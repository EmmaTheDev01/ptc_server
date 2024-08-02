import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";
import crypto from "crypto";

// User registration controller
export const register = async (req, res) => {
  try {
    const { username, email, password, phone, photo, referredBy } = req.body;

    // Check if referredBy is provided and valid
    let referrer = "";
    if (referredBy) {
      const referrerUser = await User.findOne({ referralCode: referredBy });
      if (referrerUser) {
        referrer = referredBy; // Set the referrer if the code is valid
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }
    }

    let newUser;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (photo) {
      // Usage of cloudinary to upload avatar
      let myCloud;
      try {
        myCloud = await cloudinary.v2.uploader.upload(photo, {
          folder: "avatars",
        });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading avatar",
        });
      }

      newUser = new User({
        username,
        email,
        phone,
        password: hash,
        photo: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        referredBy: referrer,
      });
    } else {
      newUser = new User({
        username,
        email,
        phone,
        password: hash,
        referredBy: referrer,
      });
    }

    // Generate referral code for the new user
    newUser.referralCode = newUser.referralCode || generateReferralCode();
    
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      referralCode: newUser.referralCode // Return the referral code of the new user
    });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create a user, try again",
    });
  }
};

// Helper function to generate referral code
const generateReferralCode = () => {
  const randomBytes = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `REF-${randomBytes}`;
};


// User authentication controllers
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkCorrectPassword = await bcrypt.compare(password, user.password);
    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { password: userPassword, role, ...rest } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set token into the browser as cookies
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
};

// Controller to get user profile
export const getProfile = async (req, res) => {
  try {
    // Fetch user profile based on the user ID from the token
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Failed to retrieve user profile:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};

// Function to generate a password reset token and send email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    // Create a password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5m",
    });

    // Construct reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request.",
    });
  }
};

// Function to reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Hash the new password and update the user's password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password successfully reset.",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

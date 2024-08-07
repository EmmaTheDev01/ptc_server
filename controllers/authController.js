import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";
import crypto from "crypto";

// User registration controller
export const register = async (req, res) => {
  console.log("Register endpoint hit"); // Log when the endpoint is hit
  try {
    const { username, email, password, phone, photo, referredBy } = req.body;

    console.log("Registration request data:", { username, email, phone, referredBy });

    // Check if referredBy is provided and valid
    let referrer = "";
    if (referredBy) {
      console.log("Checking referral code:", referredBy);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log("Password hashed successfully");

    let newUser;
    if (photo) {
      console.log("Uploading photo to Cloudinary");
      let myCloud;
      try {
        myCloud = await cloudinary.v2.uploader.upload(photo, {
          folder: "avatars",
        });
        console.log("Photo uploaded successfully:", myCloud.secure_url);
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
        referredBy,
      });
    } else {
      newUser = new User({
        username,
        email,
        phone,
        password: hash,
        referredBy,
      });
    }

    await newUser.save();
    console.log("User registered successfully:", newUser._id);

    // If a referral code was used, update the referrer’s record
    if (referrer) {
      await User.findOneAndUpdate(
        { referralCode: referrer },
        { $inc: { bonus: 100 } } // Increment bonus or any other logic
      );
    }

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      referralCode: newUser.referralCode, // Return the referral code of the new user
    });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create a user, try again",
    });
  }
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
        user: "worldoffictionrw@gmail.com",
        pass: "xwjn idbz nbjv qgtv"
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: "worldoffictionrw@gmail.com",
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

// Controller to verify user password
export const verifyPassword = async (req, res) => {
  const { password } = req.body;

  try {
    // Retrieve the user based on the authenticated user's ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({
        success: true,
        valid: true,
      });
    } else {
      res.status(200).json({
        success: true,
        valid: false,
      });
    }
  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify password",
    });
  }
};
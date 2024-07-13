import User from "../models/User.js";

// Update User Controller
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated user",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

// Update User Balance Controller
export const updateUserBalance = async (req, res) => {
    const userId = req.params.id;
    const { amount } = req.body;
  
    try {
      console.log(`Updating balance for userId: ${userId}, amount: ${amount}`);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with id ${userId} not found`
        });
      }
  
      user.currentBalance += amount; 
      user.withdrawnBalance = amount;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'User balance updated successfully, new balance: ' + user.currentBalance,
        data: user
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to update user balance, ' + err
      });
    }
  };
  


// Delete User Controller
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted user'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

// Find User Controller
export const findUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const foundUser = await User.findById(userId);
        return res.status(200).json({
            success: true,
            message: 'User details found',
            data: foundUser,
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};


// Find All Users Controller
export const findAllUsers = async (req, res) => {
    try {
        console.log('Fetching all users...');
        const allUsers = await User.find({});
        console.log('Fetched users:', allUsers);

        if (allUsers.length > 0) {
            res.status(200).json({
                success: true,
                message: "All users available",
                data: allUsers,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No users available",
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')
const crypto = require('crypto');

const User = require('../models/userModel');
const HttpError = require('../models/errorModel');
const sendEmail = require('../utils/sendEmail');

/*================= Register a New User ================ */
//post: api/users/register
//unprotected
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password) {
            return res.status(422).json({ message: "All fields are required." });
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(422).json({ message: "Email already exists for another user." });
        }

        if (password.trim().length < 6) {
            return res.status(422).json({ message: "Password should be at least 6 characters." });
        }

        if (password !== password2) {
            return res.status(422).json({ message: "Password does not match with confirm password." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const verifyEmailToken = crypto.randomBytes(20).toString('hex');

        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashedPass,
            verifyEmailToken
        });

        // Send verification email
        const verifyLink = `${process.env.BASE_URL}/api/users/verify-email?token=${verifyEmailToken}`;

        // Prepare HTML content for the email
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
            <div style="padding: 20px;">
                <img src="${process.env.BASE_URL_FRONTEND}/images/O%20koutsompolis.png" alt="O Koutsompolis Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
            </div>
            <h2 style="color: #2a9d8f;">Email Verification</h2>
            <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">
                Thank you for registering. Please verify your email by clicking the link below:
            </p>
            <p style="text-align: center; margin-bottom: 20px;">
                <a href="${verifyLink}" style="background-color: #2a9d8f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
                </a>
            </p>
            <p style="font-size: 16px;">If you did not create an account, please ignore this email or contact support.</p>
            <p style="font-size: 16px;">Best regards,<br>O Koutsompolis</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 14px; color: #777;">
                Need help? <a href="${process.env.BASE_URL_FRONTEND}/support" style="color: #2a9d8f;">Contact our support team</a>.
            </p>
        </div>
        `;

        // Send the email using your email sending function
        await sendEmail(newEmail, 'Email Verification', htmlContent);

        res.status(201).json({ message: `New user ${newUser.email} registered successfully. Please check your email to verify your account.` });
    } catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred.", error: error.message });
    }
};




const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: "All fields are required." });
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials, could not log you in." });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials, could not log you in." });
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            userId: user.id,
            name: user.name,
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred.", error: error.message });
    }
}





/*================= User Profile ================ */
//post: api/users/:id
//protected
const getUser = async (req,res,next) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not found.",404));
        }
        res.status(200).json(user);
    }
    catch(error){
        return next(new HttpError(error))
    }
}



/*================= Change User Avatar Profile ================ */
//post: api/users/change-avatar
//protected
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image.", 422));
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }

        // Delete the old avatar if it exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, "..", 'uploads', user.avatar), (err) => {
                if (err) {
                    console.error("Failed to delete old avatar:", err.message);
                }
            });
        }

        const avatar = req.files.avatar;
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture should be less than 500kb.", 422));
        }

        const fileName = avatar.name;
        const splittedFileName = fileName.split(".");
        const newFileName = `${splittedFileName[0]}_${uuid()}.${splittedFileName[splittedFileName.length - 1]}`;

        const uploadPath = path.join(__dirname, "..", 'uploads', newFileName);

        // Use a promise to handle avatar.mv
        await new Promise((resolve, reject) => {
            avatar.mv(uploadPath, (err) => {
                if (err) {
                    return reject(new HttpError(err.message, 500));
                }
                resolve();
            });
        });

        const updatedAvatar = await User.findByIdAndUpdate(req.user.userId, { avatar: newFileName }, { new: true });
        if (!updatedAvatar) {
            return next(new HttpError("Profile couldn't be changed.", 400));
        }

        res.status(200).json({ avatar: newFileName });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};





/*================= Edit User User Details ================ */
//post: api/users/edit-user
//protected
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("All fields are required."), 422);
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return next(new HttpError("User not found"), 404);
        }

        const emailExist = await User.findOne({ email });
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exists."), 422);
        }

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current Password."), 422);
        }

        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("New Passwords do not match."), 422);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(req.user.userId, { name, email, password: hashedPassword }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}



/*================= Get Authors ================ */
//post: api/users/authors
//protected
const getAuthors = async (req,res,next) =>{
    try{
        const authors = await User.find().select('-password');
        res.json(authors)
    }
    catch(error){
        return next(new HttpError(error))
    }
}


const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) {
            console.log("Invalid or missing token.");
            return res.status(400).json({ message: "Invalid or missing token." });
        }

        const user = await User.findOne({ verifyEmailToken: token });
        console.log("Token received:", token);
        console.log("User found:", user);

        if (!user) {
            console.log("Invalid or expired token.");
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.isVerified = true;
        await user.save();

        // Redirect to frontend verification page
        return res.redirect(`${process.env.BASE_URL_FRONTEND}/verify-email?token=${token}`);
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "An unexpected error occurred.", error: error.message });
    }
};




const { getLeaderboard } = require('../utils/scheduler');
console.log('Imported getLeaderboard function:', getLeaderboard);
const getTopContributors = (req, res) => {
  try {
    const leaderboard = getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching top contributors from cache:', error);
    res.status(500).json({ message: 'Error fetching top contributors' });
  }
};



module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors, verifyEmail, getTopContributors};
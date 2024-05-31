const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const User = require('../models/userModel')
const HttpError = require('../models/errorModel')



/*================= Register a New User ================ */
//post: api/users/register
//unprotected
const registerUser = async (req,res,next) =>{
    try{
        const {name, email, nickname, password, password2} = req.body;
        if(!name || !email || !nickname || !password){
            return next(new HttpError("All fields are required.",422));
        }
        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({email: newEmail})
        if(emailExists){
            return next(new HttpError("Email already exist by other User.",422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password should be at least 6 characters.",422))
        }

        if((nickname.trim()).length < 3){
            return next(new HttpError("Nickname should be at least 3 characters.",422))
        }

        if(password != password2){
            return next(new HttpError("Password do not match with confirm password.",422))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, nickname, password: hashedPass})
        res.status(201).json(`New user ${newUser.email} registered successfully.`);

    }
    catch(error){
        return next(new HttpError("User Registration Failed.",422));
    }
}




/*================= Login a registered User ================ */
//post: api/users/login
//unprotected
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError("All fields are required.", 422));
        }
        const newEmail = email.toLowerCase();

        // Use a different variable name to store the result of User.findOne
        const user = await User.findOne({ email: newEmail });

        console.log(user);
        if (!user) {
            return next(new HttpError("Invalid credentials, could not log you in.", 401));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new HttpError("Invalid credentials, could not log you in.", 401));
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            userId: user.id,
            name: user.name,
            nickname: user.nickname,
            token: token
        });

    } catch (error) {
        return next(new HttpError("Login failed, please try again later.", 500));
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
        
        if (user.avatar) {
            fs.unlink(path.join(__dirname, "..", 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError(err.message, 500));
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
        
        avatar.mv(path.join(__dirname, "..", 'uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err.message, 500));
            }
        });
        
        const updatedAvatar = await User.findByIdAndUpdate(req.user.userId, { avatar: newFileName }, { new: true });
        if (!updatedAvatar) {
            return next(new HttpError("Profile couldn't be changed.", 400));
        }
        
        res.status(200).json(updatedAvatar);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};




/*================= Edit User User Details ================ */
//post: api/users/edit-user
//protected
const editUser = async (req,res,next) =>{
    try{
        const {name, email,nickname, currentPassword, newPassword, newConfirmPassword} = req.body;
        if(!name || !email || !nickname ||!currentPassword || !newPassword){
            return next(new HttpError("All fields are required."),422);
        }

        const user = await User.findById(req.user.userId);
        console.log(user);
        if(!user){
            return next(new HttpError("User not found"),404);
        }
        const emailExist = await User.findOne({email});
        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email already exist."),422);
        }

        const nickNameExist = await User.findOne({nickname});
        if(nickNameExist && (nickNameExist._id != req.user.id)){
            return next(new HttpError("Nickname already exist."),422);
        }
    
        const validateUserPassword = await bcrypt.compare(currentPassword,user.password);
        if(!validateUserPassword){
            return next(new HttpError("Invalid current Password."),422);
        }

        if(newPassword !== newConfirmPassword){
            return next(new HttpError("New Password do not match."),422);
        }

        const salt= await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(newPassword, salt);

        const newInfo = await User.findByIdAndUpdate(req.user.userId, {name, email, nickname, password: Hash}, {new:true})
        res.status(200).json(newInfo);

    }
    catch(error){
        return next (new HttpError(error))
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


module.exports = {registerUser,loginUser, getUser, changeAvatar, editUser, getAuthors}
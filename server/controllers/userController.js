const  User = require("../models/userModel");
const HttpError = require("../models/errorModel")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs");
const {v4: uuid} =require("uuid");
const path = require("path");
/*#####################REGISTER######################## */
// post: api/users/register
const registerUser = async (req ,res , next) => {
    try {
        const {name , email , password , password2} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("please enter all the fields ", 422))
        }
        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email : newEmail })
        if(emailExists) {
            return next(new HttpError("please enter new email id ", 422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("please enter more than 6 character  password" , 422));
        }

        if(password != password2){
            return next(new HttpError("please enter the correct password" , 422));
        }

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password , salt);
        const newUser  = await User.create({name , email: newEmail , password: hashPass});
        res.status(201).json(newUser);
    } catch (error) {
        return next(new HttpError("user registration failed" , 422))
    }
}


/*##################### LOGIN ######################## */
// post: api/users/login
const loginUser = async (req ,res , next) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return next(new HttpError("Please enter the details" , 422));
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({email : newEmail});
        if(!user){
            return next (new HttpError("Please enter the correct credentials" , 422));
        }
        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next (new HttpError("Please enter the correct credentials" , 422));
        }
        // token creation 
        const {_id: id , name} = user;
        const token = jwt.sign({id , name}, process.env.JWT_SECRET , {expiresIn : "1d"} )

        res.status(200).json({token , id , name})
    } catch (error) {
        return next(new HttpError("login failed please try again " , 422)) 
    }
}


/*#####################PROFILE######################## */
// post: api/users/:id
const getUser = async (req ,res , next) => {
   try {
    const{id} = req.params;
    const user = await User.findById(id).select('-password');
    if(!user){
        return next(new HttpError("User not found" , 404))
    }
    res.status(200).json(user)
   } catch (error) {
    return next(new HttpError("Cant load the details" , 422)) 
   }
}



/*#####################CHANGE AVATAR PROFILE ######################## */
// post: api/users/change-avatar
const changeAvatar = async (req ,res , next) => {
    try {
        if(!req.files.avatar){
            return next (new HttpError("please upload an image" , 422))
        }
        // find the user from the db
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return next(new HttpError("user cant be found" , 422))
        }
        // delete the old avatar if exists
        if(user.avatar){
            fs.unlink(path.join(__dirname, '..' , "uploads" , user.avatar) , (err) =>{
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avatar} = req.files;
        if(avatar.size > 500000){
        return next( new HttpError("the image is too big the limit is 550kb " , 422)) 
        }
        let fileName;
        fileName = avatar.name;
        let spllitedName =  fileName.split(".");
        let newFileName = spllitedName[0] + uuid() + '.' + spllitedName[spllitedName.length - 1];
        avatar.mv(path.join(__dirname , '..' , 'uploads' , newFileName) ,async (err) => {
            if(err){
                return next(new HttpError(err));
            }
            const updatedFileName = await User.findOneAndUpdate({ _id: req.user.id } , { avatar: newFileName }, { new: true }); //{ _id: req.user.id }
            if(!updatedFileName){
                return next(new HttpError("avatar cant be updated" , 422));
            }
            res.status(200).json(updatedFileName)
        })
    } catch (error) {
        return next( new HttpError("cant change the avatar" , 422))
    }
}


/*#####################EDIT USER DETAILS######################## */
// post: api/users/edit-user
const editUser = async (req ,res , next) => {
try {
    const {name , email , CurrentPassword , NewPassword  , ConfirmPassword} = req.body;
    if(!name || !email ||  !CurrentPassword || !NewPassword || !ConfirmPassword){
        return next(new HttpError("please enter the valid details"))
    }
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new HttpError("user not found" , 422));
    }

    const EmailExists = await User.findOne({email});
    // if email exists dont change the email as its useed for login purposes
    if(EmailExists && (EmailExists._id === req.user.id)){
        return next (new HttpError("email already exists" , 403));
    }
    const validatePassword = await  bcrypt.compare(CurrentPassword , user.password);
    
    if(!validatePassword){
        return next(new HttpError("invalid current password") , 422);
    }
    if(NewPassword !== ConfirmPassword){
        return next(new HttpError("password dont match") , 422);
    }
    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(NewPassword, salt);

    const newInfo = await User.findByIdAndUpdate(req.user.id , {email , name , password : hash} , {new: true});
    res.status(200).json(newInfo);
} catch (error) {
    return next(new HttpError(error));
}
}

/*#####################GET AUTHORS######################## */
// post: api/users/register
const getAuthors = async (req ,res , next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next (HttpError("cant fetch all the authors" , 422))
    }
}


module.exports = {getAuthors , getUser , registerUser , loginUser , editUser ,  changeAvatar}
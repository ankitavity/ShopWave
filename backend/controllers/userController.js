const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncErrors = require("./../middleware/catchAsyncErrors");
const User = require('./../models/userModels');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");




//Regiser A User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder : "avatars",
        width : 150,
        crop : "scale",
    })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);

})



///Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;


    //Checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400))
    }

    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (isPasswordMatched === false) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }



    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success : true,
    //     token
    // });

    sendToken(user, 200, res);


})


// Logout

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })



    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})


// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User Not found", 404));
    }
    //Get Reset Password Token

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is ttemp:- \n\n ${resetPasswordUrl} \n\nIf You Have not requested this email then please ignore it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: `ShopWave Password Recovery`,
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfuly`,

        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },

    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 404));

    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 404));

    }


    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);


})

// Get User Details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})


//  update User Password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);


    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Old Password is Incorrect",401));
    }
    
    if(req.body.newPassword!==req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password does not match",401));

    }

    user.password = req.body.newPassword;


    await user.save();


    sendToken(user,200,res);


    // res.status(200).json({
    //     success:true,
    //     user,
    // })
})


//  update User Profile

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }


    
    if(req.body.avatar!=="")
    {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "avatars",
            width : 150,
            crop : "scale",
        })
        newUserData.avatar = {
            url: myCloud.secure_url,
            public_id: myCloud.public_id,
        }
    }
        
    
    
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new : true,
        runValidators:true,
        useFindAndModify:false,
    });
    // sendToken(user,200,res);

    res.status(200).json({
        success:true,
    })

})

//Get All Users

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})


//Get Single User--(Admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);


    if(!user){
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        user
    })
})


//  update User Role

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      };
    
      await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    
      res.status(200).json({
        success: true,
      });

})


//  Delete  User --Admin

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    
    
    if(!user)
    {
        return next(new ErrorHandler(`User does nit exist with id ${req.params.id}`,404));
    }
    
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.deleteOne();
    // sendToken(user,200,res);

    res.status(200).json({
        success:true,
        message : "User Deleted Successfully"
    })

})


//User Contact


exports.contactAdmin = catchAsyncErrors(async (req, res, next) => {

    const email = req.body.email;
    const name = req.body.name;
    const subject = req.body.subject;
    const message = req.body.message;
    const phoneNo = req.body.phoneNo;
    try {

        await sendEmail({
            email: "subhamchandra.12a.6@gmail.com",
            subject: subject,
            message: `User with name ${name} and email : ${email} and phone no.${phoneNo} has sent a message : ${message}`,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to Admin successfuly`,

        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})
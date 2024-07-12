// eslint-disable-next-line import/no-extraneous-dependencies
const crypto=require('crypto') 

const jwt =require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const asyncHandler = require("express-async-handler");
const ApiError =require('../utils/apiError')
const sendEmail =require('../utils/sendEmail')
const User = require('../models/userModel');

const createToken =require('../utils/createToken')
//@desc signup
//@route post /api/v1/auth/signup
//@access Public
exports.signup = asyncHandler(async(req,res,next)=>{
    //1- Create User
    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    //2-Generate Token
    const token =createToken(user._id);

    res.status(201).json({data:user,token})
})

//@desc login
//@route post /api/v1/auth/login
//@access Public
exports.login=asyncHandler(async(req,res,next)=>{
    // 1) Check if user email and password in send in the body 
    // 2) Check if user is exist & Check if password correct
    const user = await User.findOne({email:req.body.email})
    if(!user || !(await bcrypt.compare(req.body.password,user.password))){
        return next(new ApiError('Incorrect email or password ',401))
    }
    // 3) Generate token
    const token =createToken(user._id);

    // 4) Send Response to client 
    res.status(200).json({data:user,token:token})
})

//@desc make sure that user is loggedin
exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
    // 1) check if token exit if exist hold it 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token =req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ApiError("you are not login,please log in to get access this route",401))
    }
    // 2) verify token (no change happend ,expired token )
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    // 3) check if user exists
    const currentUser=await User.findById(decoded.userId);
    if(!currentUser){
        return next(new ApiError("The user that belong to this token no longer exist",401))
    }
    //4)check if user change his password after token created
    if(currentUser.passwordChangedAt){
        const passwordChangedTimeStm=parseInt(currentUser.passwordChangedAt/1000,10)
        //User change password after token created
        if(passwordChangedTimeStm > decoded.iat){
            return next(new ApiError("User recently change his password ,plz login again",401))
        }
    }
    req.user=currentUser;
    next()
    // 4) check if user chnage his passwor after token created  
})

// @desc Authorization (User Permissions)
// ["admin","manager"]
exports.allowedTo=(...rules)=>
    asyncHandler(async(req,res,next)=>{
        //1) access rules
        //2) access regestered user {req.user.rule}
        if(!rules.includes(req.user.role)){
            return next(new ApiError("You are not allowed to access the route ", 403))
        }
        next()
})


//@desc forgot password
//@route post /api/v1/auth/forgotPassword
//@access Public
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
    //1) Get user by email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ApiError(`There is no user with that email ${req.body.email}`,404))
    }
    //2) If user exiest , Generate random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode =crypto.createHash('sha256').update(resetCode).digest('hex')
    // Save hashed Reset Code into db 
    user.passwordResetCode=hashedResetCode;
    // Add Expiration time for password reset code (10 minute)
    user.passwordResetExpires =Date.now()+ 10*60*1000;

    user.passwordResetVerified=false;
    await user.save();
    //3)Send the reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError('There is an error in sending email', 500));
    }
    res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
})


//@desc verify password reset code
//@route post /api/v1/auth/verifyResetCode
//@access Public
exports.verifyResetCode = asyncHandler(async (req,res,next)=>{
    //1) Get user based on reset code 
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex')

    const user = await User.findOne({passwordResetCode:hashedResetCode, passwordResetExpires:{$gt:Date.now()}})

    if(!user){
        return next(new ApiError("Reset code invalid or expired",401))
    }
    //2) Reset code verified
    user.passwordResetVerified=true;
    await user.save();
    res.status(200).json({status:"Success"})
})

//@desc reset password
//@route post /api/v1/auth/resetPassword
//@access Public
exports.resetPassword =asyncHandler(async(req,res,next)=>{
    //1) Get user
    const user= await User.findOne({email:req.body.email})
    if(!user){
        return next(new ApiError(`There is no user for this email: ${req.body.email}`,404))
    }

    //2) check if password verified
    if(!user.passwordResetVerified){
        return next(new ApiError(`Reset code not verified `,400))
    }

    user.password=req.body.newPassword;

    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    //3) Generate new token 
    const token =createToken(user._id)
    res.status(200).json({token})
})
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt =require('bcrypt');

const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadsingleImageMiddleware');
const ApiError =require('../utils/apiError')
const createToken =require('../utils/createToken')
const User = require('../models/userModel');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if(req.file){
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/users/${filename}`);
        // Save image into our db 
        req.body.profileImg = filename;
    }
    next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin, Manager
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,
      },
      {
        new: true,
      }
    );
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

// @desc    Update user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Public
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt:Date.now()
        },
        {
        new: true,
        }
    );
    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);


// @desc    Get logged user data 
// @route   GET /api/v1/users/personalInfo
// @access  Private/protect
exports.getPersonalInfo=asyncHandler(async(req,res,next)=>{
  req.params.id=req.user._id;
  next()
})

// @desc    Update logged user password 
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/protect
exports.updateloggedUserPassword=asyncHandler(async (req, res, next) => {
  //1) update logged user password based on user payload
  const user = await User.findByIdAndUpdate(
      req.user._id,
      {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt:Date.now()
      },
      {
      new: true,
      }
  );
  //2) Generate Token
  const token =createToken(req.user._id);
  res.status(200).json({ data: user,token });
});

// @desc    Update logged user data without password and role 
// @route   PUT /api/v1/users/updateMe
// @access  Private/protect

exports.updateLoggedUserData=asyncHandler(async(req,res,next)=>{
const updatedUser = await User.findOneAndUpdate(
  req.user._id,
  {
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone
  },
  {new:true})

  res.status(200).json({ data:updatedUser });

})

// @desc    Deactivate logged user
// @route   PUT /api/v1/users/deleteMe
// @access  Private/protect
exports.deleteLoggedUserData =asyncHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._d,{active:false});
  res.status(204).json({status:"Success"})
})

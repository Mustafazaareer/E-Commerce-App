// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler')

const factory =require('./handlersFactory');
const {uploadSingleImage} =require('../middlewares/uploadsingleImageMiddleware')

const Category =require('../models/categoryModel');



exports.resizeImages= asyncHandler(async(req,res,next)=>{
    if(req.file){
        const filename =`category-${uuidv4()}-${Date.now()}.jpeg`
        sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/categories/${filename}`);
        // Save Image Into Our DB 
        req.body.image=filename;
    }
    next();
})

exports.uploadCategoryImage = uploadSingleImage('image');

//@desc Get list of categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories =factory.getAll(Category)

//@desc Get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory =factory.getOne(Category)

//@desc Create category
//@route POST /api/v1/categories
// @access  Private/Admin-Manager
exports.createCategory = factory.createOne(Category)

//@desc Update specific category by id
//@route PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCategory =factory.updateOne(Category);

//@desc Delete specific category by id
//@route DELETE /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.deleteCategory=factory.deleteOne(Category)



// exports.deleteCategory =asyncHandler( async(req,res,next)=>{
//     // const id =req.params.id;
//     const {id}= req.params;
//     const category =await Category.findOneAndDelete({_id:id});
//     if(!category){
//         return next(new ApiError(`No category for this id : ${id}`,404))
//     }
//     res.status(204).send()
// })
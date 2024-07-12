const asyncHandler = require('express-async-handler')
const SubCategory =require('../models/subCategorymodel')
const factory =require('./handlersFactory')


//@desc Create subCategory
//@route POST /api/v1/subcategories
//@access  Private/Admin-Manager
exports.createSubCategory = factory.createOne(SubCategory)

//@desc Get list of subCategories
//@route GET /api/v1/subcategories
//@access Public
exports.getSubCategories =factory.getAll(SubCategory)

//@desc Get specific subCategory by id
//@route GET /api/v1/subcategories/:id
//@access Public
exports.getSubCategory =factory.getOne(SubCategory)

//@desc Update specific subCategory by id
//@route PUT /api/v1/subCategories/:id
//@access  Private/Admin-Manager
exports.updateSubCategory =factory.updateOne(SubCategory);

//@desc Delete specific subCategory by id
//@route DELETE /api/v1/subCategories/:id
//@access  Private/Admin-Manager
exports.deleteSubCategory=factory.deleteOne(SubCategory)

//nested routes

exports.setFilter=asyncHandler((req,res,next)=>{
    let filterObject = {};
    if(req.params.categoryId){filterObject={category:req.params.categoryId}};
    req.filterObj=filterObject;
    next();
})
exports.setCategory=asyncHandler((req,res,next)=>{
    if(!req.body.category) req.body.category =req.params.categoryId;
    next();
})
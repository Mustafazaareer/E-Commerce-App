const express = require('express')
// mergeParams : Allow us access parameters on others routers
//ex: we need to access category id from category router 
const router= express.Router({mergeParams:true});

const{
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
    
} =require('../utils/validators/subCategoryValidator')

const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setFilter,
    setCategory
} =require('../services/subCategoryService')
const authService=require('../services/authService')



router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin','manager'),
        setCategory,
        createSubCategoryValidator,
        createSubCategory)
    .get(setFilter,getSubCategories)

    
router.route("/:id")
    .get(getSubCategoryValidator,getSubCategory)
    .put(
        authService.protect,
        authService.allowedTo('admin','manager'),
        updateSubCategoryValidator,
        updateSubCategory)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteSubCategoryValidator,
        deleteSubCategory)
module.exports = router;
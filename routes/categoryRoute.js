const express =require("express");
// eslint-disable-next-line import/no-extraneous-dependencies

const {getCategoryValidator,createCategoryValidator,deleteCategoryValidator,updateCategoryValidator} =require('../utils/validators/categoryValidator')
const authService=require('../services/authService')
const {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory ,
    uploadCategoryImage,
    resizeImages} =require('../services/categoryService');

const subCategoriesRoute =require('./subCategoryRoute')

const router =express.Router();
//Routes

router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin','manager'),
        uploadCategoryImage,
        resizeImages,
        createCategoryValidator,
        createCategory)

    .get(getCategories)
// Nested Route
router.use('/:categoryId/subcategories',subCategoriesRoute)

router.route("/:id")
    .get(getCategoryValidator,getCategory)
    .put(
        authService.protect,
        authService.allowedTo('admin','manager'),
        uploadCategoryImage,
        resizeImages,
        updateCategoryValidator,
        updateCategory)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteCategoryValidator,
        deleteCategory)

module.exports = router;

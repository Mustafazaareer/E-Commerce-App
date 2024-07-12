const express =require("express");
const {getProductValidator,createProductValidator,deleteProductValidator,updateProductValidator} =require('../utils/validators/productValidator')
const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeImages
} =require('../services/productService');
const authService=require('../services/authService')
const reviewsRoute =require('./reviewRoute')


const router =express.Router();



// Nested Route
// POST  /products/productId/reviews
// GET  /products/productId/reviews
// GET  /products/productId/reviews/reviewId

router.use('/:productId/reviews',reviewsRoute)


//Routes

router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin','manager'),
        uploadProductImages,
        resizeImages,
        createProductValidator,
        createProduct)
    .get(getProducts)

router.route("/:id")
    .get(getProductValidator,getProduct)
    .put(
        authService.protect,
        authService.allowedTo('admin','manager'),
        uploadProductImages,
        resizeImages,
        updateProductValidator,
        updateProduct)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteProductValidator,
        deleteProduct)

module.exports = router;
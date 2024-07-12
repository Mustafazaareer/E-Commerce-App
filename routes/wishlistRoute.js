const express = require('express');

const authService=require('../services/authService')
// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require('../utils/validators/brandValidator');

const {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWoshlist
} = require('../services/wishlistService');

const router = express.Router();

router.use(authService.protect,authService.allowedTo('user'),)

router.route('/').post(addProductToWishlist).get(getLoggedUserWoshlist)
router.delete('/:productId',removeProductFromWishlist)

module.exports = router;
const express = require('express');

const authService=require('../services/authService')
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator
} = require('../utils/validators/reviewValidator');

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
  setFilter
} = require('../services/reviewService');

const router = express.Router({mergeParams:true});

router
  .route('/')
  .get(setFilter,getReviews)
  .post(
    authService.protect,
    authService.allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview);
    
router
  .route('/:id')
  .get(getReviewValidator,getReview)
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview)
  .delete(
    authService.protect,
    authService.allowedTo('user'),
    deleteReviewValidator,
    deleteReview)

module.exports = router;
const express = require('express');

const authService=require('../services/authService')
const {
  createCashOrder,
  filterOrderForLoggedUser,
  getOrder,
  getOrders,
  updateOrderToDelivard,
  updateOrderToPaid,
  checkoutSession
} = require('../services/orderService');

const router = express.Router();
router.use(authService.protect)
router
  .route('/:cartId')
  .post(authService.allowedTo('user'),createCashOrder)

router
  .route('/')
  .get(authService.allowedTo('user','admin','manager'),filterOrderForLoggedUser,getOrders)

router
  .route('/:id')
  .get(getOrder)

router.get('/checkout-session/:cartId',authService.allowedTo('user'),checkoutSession)
router.put("/:id/pay",authService.allowedTo('admin','manager'),updateOrderToPaid)
router.put("/:id/delivar",authService.allowedTo('admin','manager'),updateOrderToDelivard)

module.exports = router;
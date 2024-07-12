
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError')
const factory = require('./handlersFactory');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


// @desc    Creat cash order
// @route   POST /api/v1/orders
//@access  Private/User
exports.createCashOrder = asyncHandler(async(req,res,next)=>{
  const taxPrice =0;
  const shippingPrice=0;
  // 1) Get cart depend on cart id 
    const cart = await Cart.findById(req.params.cartId)
  if(!cart){
    return new ApiError(`There is no cart for this cart id : ${req.params.cartId}`,404)
  }
  // 2) Get Order price depend on cart price and check if coupon is apply
  const cartPrice = cart.totalPriceAfterDiscount ?cart.totalPriceAfterDiscount : cart.totalCartPrice;
  // 3) Create order with paymentMethodType cash
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) After create Order update(decrement) product quantity and increment sold in product model 
  if(order){
    const bulkOption = cart.cartItems.map((item) =>({
      updateOne:{
        filter:{_id:item.product},
        update:{$inc:{quantity:-item.quantity,sold:+item.quantity}}
      }
    }))
    await Product.bulkWrite(bulkOption,{})
      // 5) Clear cart depend on cartId /params
    await Cart.findByIdAndDelete(req.params.cartId)
  }

  res.status(201).json({status:"success",data:order})
})


exports.filterOrderForLoggedUser = asyncHandler(async(req,res,next)=>{
  if(req.user.role === 'user'){
    req.filterObj ={user:req.user._id}
  }
  next()
})

// @desc    Get all Orders
// @route   POST  /api/v1/orders
//@access  Private/User-Admin-Manager
exports.getOrders = factory.getAll(Order);



// @desc    Get specific Order by id
// @route   GET /api/v1/orders/:id
//@access  protected/user/admin/manager
exports.getOrder = factory.getOne(Order);



// @desc    Update Order paid status to paid 
// @route   PUT /api/v1/Orders/:id/pay
//@access  Private/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req,res,next)=>{
  const order = await Order.findById(req.params.Id)
  if(!order){
    return new ApiError(`There is no such order for this id : ${req.params.id} `)
  }
  order.isPaid =true;
  order.paidAt= Date.now()

  const updateOrder = await order.save();
  res.status(200).json({status:"Success",data:updateOrder})
})


// @desc    Update Order Delivard status to Delivard 
// @route   PUT /api/v1/Orders/:id/delivard
//@access  Private/Admin-Manager
exports.updateOrderToDelivard = asyncHandler(async (req,res,next)=>{
  const order = await Order.findById(req.params.Id)
  if(!order){
    return new ApiError(`There is no such order for this id : ${req.params.id} `)
  }
  order.isDelivard =true;
  order.delivardAt= Date.now()

  const updateOrder = await order.save();
  res.status(200).json({status:"Success",data:updateOrder})
})

// @desc    Delete specific Order
// @route   DELETE /api/v1/Orders/:id/
//@access  Private/Admin-Manager
exports.deleteOrder = factory.deleteOne(Order);



// @desc    Get stripe checkout session and send as response
// @route   GET /api/v1/Orders/checkout-session/cartId
//@access  Private/User

exports.checkoutSession = asyncHandler(async (req,res,next)=>{
  const taxPrice =0;
  const shippingPrice=0;
  // 1) Get cart depend on cart id 
    const cart = await Cart.findById(req.params.cartId)
  if(!cart){
    return new ApiError(`There is no cart for this cart id : ${req.params.cartId}`,404)
  }
  // 2) Get Order price depend on cart price and check if coupon is apply
  const cartPrice = cart.totalPriceAfterDiscount ?cart.totalPriceAfterDiscount : cart.totalCartPrice;
  // 3) Create order with paymentMethodType cash
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  console.log(totalOrderPrice)
  // 4) Create stripe checkout session 
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      quantity:1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.floor(totalOrderPrice),
        product_data: {
          name:req.user.name
        },
      },
    }],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email:req.user.email,
    client_reference_id:cart._id,
    metadata:req.body.shippingAddress
  })
  // 5) send session to response  
  res.status(200).json({status:'Success',data:session})
})

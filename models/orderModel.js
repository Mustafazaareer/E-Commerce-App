
const mongoose = require('mongoose');
const User =require('./userModel')
// 1- Create Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref:User,
      require:[true,'Order must belong to User']
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: String,
            price: Number,
        },
    ],
    taxPrice:{
        type:Number,
        default:0
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    shippingPrice:{
        type:Number,
        default:0
    },
    totalOrderPrice:{
        type:Number,
    },
    paymentMethodType:{
        type:String,
        enum:['card','cash'],
        default:'cash'
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    isDelivard:{
        type:Boolean,
        dafault:false
    },
    delivardAt:Date
  },
  { timestamps: true }
);

orderSchema.pre(/^find/,function (next) {
    this.populate({
        path:'user',
        select:'name profileImg email phone'
    }).populate({
        path:'cartItems.product',
        select :'title imageCover'
    })
    next();
})

module.exports = mongoose.model('Order', orderSchema);

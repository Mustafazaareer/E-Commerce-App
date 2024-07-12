
const mongoose = require('mongoose');
// 1- Create Schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon required'],
      trim:true,
      unique: [true, 'Coupon must be unique'],
    },
    expire: {
      type: Date,
      required: [true,'Coupone expire time required'],
    },
    discount:{
        type:Number,
        required:[true,'Coupon discount value required']
    }
  },
  { timestamps: true }
);

// 2- Create model
module.exports = mongoose.model('Coupon', couponSchema);

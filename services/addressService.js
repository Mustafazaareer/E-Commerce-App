const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User

exports.addAddress= asyncHandler(async (req,res,next)=>{
    //$addToSet => add address object to addresses array if address not exist
    const user = await User.findByIdAndUpdate(req.user._id ,{
        $addToSet:{addresses:req.body}
    },{new:true})
    res
        .status(200)
        .json({
            status:"successs",
            message:"Address added successfully to your Addresses List. ",
            data:user.addresses
        })
})

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User

exports.removeAddress= asyncHandler(async (req,res,next)=>{
    //$pull => remove address object from user addresses array if addressId exist
    const user = await User.findByIdAndUpdate(req.user._id ,{
        $pull:{addresses:{_id:req.params.addressId}}
    },{new:true})
    res
        .status(200)
        .json({
            status:"successs",
            message:"Address removed successfully from your address list. ",
            data:user.addresses
    })
})

// @desc    GET logged user addresses
// @route   GET /api/v1/addresses
// @access  Protected/User

exports.getLoggedUserAddresses= asyncHandler(async (req,res,next)=>{
    //$pull => remove productId from wishlist array if productId exist
    const user = await User.findById(req.user._id).populate('addresses')
    res
        .status(200)
        .json({
            status:"successs",
            result:user.addresses.length,
            data:user.addresses
    })
})

// eslint-disable-next-line import/no-extraneous-dependencies
const bycrpt = require('bcryptjs');

const mongoose =require('mongoose')


// 1- Create Schema
    const userSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        trim:true,
        required: [true, 'Name Required !'],
        },
        slug: {
        type: String,
        lowercase: true,
        },
        email: {
            type:String,
            required:[true,'Email Required !'],
            unique:true,
            lowercase:true
        },
        phone:String,
        profileImg:String,
        password:{
            type:String,
            required:[true,'User Password Required !'],
            minlength:[6,'Too Short User Password']
        },
        passwordChangedAt:{
            type:Date
        },
        passwordResetCode:{
            type:String
        },
        passwordResetExpires:{
            type:Date
        },
        passwordResetVerified:Boolean,
        role:{
            type:String,
            enum:['user','admin'],
            default:'user'
        },
        active:{
            type:Boolean,
            default:true
        },
        // child reference (one to many)
        wishlist: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
        ],
        addresses: [
            {
                id: { type: mongoose.Schema.Types.ObjectId },
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalCode: String,
            },
        ],
        },
    { timestamps: true }
    );

    userSchema.pre('save',async function (next){
        if(!this.isModified('password'))return next();
        //Haching User Password
        this.password= await bycrpt.hash(this.password,12)
        next();
    })

const User =mongoose.model('User', userSchema);
module.exports = User;
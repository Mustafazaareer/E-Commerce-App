const mongoose = require('mongoose');

const subCategorySchema =new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
            unique:[true,'SubCategory name must be unique'],
            minlength:[2,'Too short subCategory name'],
            maxlength:[32,'Too long subCategory name']
        },
        slug:{
            type:String,
            lowercase:true
        },
        category:{
            type:mongoose.Schema.ObjectId,
            ref:'Category',
            required:true
        }
    },{timestamps:true}
)

module.exports =mongoose.model('subCategory',subCategorySchema)
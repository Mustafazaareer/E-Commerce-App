
const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');

const asyncHandler = require('express-async-handler')
const Product =require('../models/productModel')
const factory =require('./handlersFactory')
const {uploadMixOfImages}= require('../middlewares/uploadsingleImageMiddleware')

exports.uploadProductImages = uploadMixOfImages([
        {
          name: 'imageCover',
          maxCount: 1,
        },
        {
          name: 'images',
          maxCount: 5,
        },
]);

exports.resizeImages= asyncHandler(async(req,res,next)=>{
        if(req.files.imageCover){
        const imageCoverFileName =`product-${uuidv4()}-${Date.now()}-cover.jpeg`
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/products/${imageCoverFileName}`);
        // Save Image Into Our DB 
        req.body.imageCover=imageCoverFileName;
    }
    if(req.files.images){
        req.body.images=[ ]
        
        await Promise.all(
            req.files.images.map(async(img,index)=>{
                const imageName =`product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`
                await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(`uploads/products/${imageName}`);
                // Save Image Into Our DB 
                req.body.images.push(imageName);
            })
        )
    }

    next();
})

//@desc Get list of products
//@route GET /api/v1/products
//@access Public

exports.getProducts = factory.getAll(Product)

// let mongooseQuery =Product.find(JSON.parse(queryStr))
// .populate({path:'category',select:'name -_id'});
// Filtrating :
// .where('price')
// .equals(req.query.price)
// .where('ratingsAverage')
// .equals(req.query.ratingsAverage)

//@desc Get specific Product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct =factory.getOne(Product,'reviews')
// const product =await Product.findById(id).populate({path:'category',select:'name -_id'});

//@desc Create product
//@route POST /api/v1/products
//@access  Private/Admin-Manager
exports.createProduct = factory.createOne(Product)

//@desc Update specific category by id
//@route PUT /api/v1/categories/:id
//@access  Private/Admin-Manager
exports.updateProduct =factory.updateOne(Product);

//@desc Delete specific category by id
//@route DELETE /api/v1/categories/:id
//@access  Private/Admin-Manager
exports.deleteProduct=factory.deleteOne(Product)

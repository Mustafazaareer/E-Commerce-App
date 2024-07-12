const mongoose = require('mongoose');

const setImageURL = require('../utils/setImageURL')
// mongoose schema
// 1- create schema 
const categorySchema =new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Category name required"],
        unique:[true,"Categoty name must be unique"],
        minlength:[3,"Too short category name"],
        maxlength:[32,"Too long category name"]
    }, // String is shorthand for {type: String}
    // categoty name A and B ==>with slog would be==>shoping.com/a-and-b
    slug:{
        type:String,
        lowercase:true
    },
    image:String
},  { timestamps: true}
)

// return image base url + image name
// const setImageURL = (doc)=>{
//     const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`
//     doc.image =imageURL;
// }
    //findOne , findAll , updateOne
    categorySchema.post('init', (doc)=> {
        setImageURL(doc)
    });
    //createOne
    categorySchema.post('save', (doc)=> {
        setImageURL(doc)
    })

//2- create model
const CategoryModel =mongoose.model('Category',categorySchema)

module.exports =CategoryModel;
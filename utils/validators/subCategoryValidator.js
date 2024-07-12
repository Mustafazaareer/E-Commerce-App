const {check,body } = require('express-validator');
const slugify = require('slugify')
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.createSubCategoryValidator =[
    check('name')
        .notEmpty()
        .withMessage('SubCategory name required')
        .isLength({min:2})
        .withMessage("Too short Subcategory name")
        .isLength({max:32})
        .withMessage("Too short Subcategory name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category')
        .notEmpty()
        .withMessage("subCategory must belong to Category")
        .isMongoId()
        .withMessage("invalid Subcategory id form "),
    validatorMiddleware
]
exports.getSubCategoryValidator =[
    check('id').isMongoId().withMessage('Invalid SubCategory Id Format!'),
    validatorMiddleware
]
exports.deleteSubCategoryValidator =[
    check('id')
        .notEmpty()
        .isMongoId()
        .withMessage('Invalid SubCategory Id Format!'),
    check('category')
        .isMongoId()
        .withMessage('Invalid category Id Format!'),
    validatorMiddleware
]
exports.updateSubCategoryValidator =[
    check('id').isMongoId().withMessage('Invalid SubCategory Id Format!'),
    body("name").custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validatorMiddleware
]
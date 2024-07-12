const {check,body } = require('express-validator');
const slugify  = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.createCategoryValidator =[
    check('name')
        .notEmpty().withMessage('Category name required')
        .isLength({min:3}).withMessage("Too short category name")
        .isLength({max:32}).withMessage("Too short category name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
          }),
    validatorMiddleware
]
exports.getCategoryValidator =[
    check('id').isMongoId().withMessage('Invalid Category Id Format!'),
    validatorMiddleware
]
exports.deleteCategoryValidator =[
    check('id').isMongoId().withMessage('Invalid Category Id Format!'),
    validatorMiddleware
]
exports.updateCategoryValidator =[
    check('id').isMongoId().withMessage('Invalid Category Id Format!'),
    body("name")
    .optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validatorMiddleware
]
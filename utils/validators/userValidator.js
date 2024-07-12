const bcrypt =require('bcrypt')
const slugify = require('slugify');
const { check,body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User =require('../../models/userModel')


exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User required')
        .isLength({ min: 3 })
        .withMessage('Too short User name')
        .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        }),

    check('email')
        .notEmpty().withMessage('User Email Required')
        .isEmail().withMessage('Invalid Email Address')
        .custom((val) =>
        User.findOne({ email: val }).then((user) => {
            if (user) {
            return Promise.reject(new Error('E-mail already in use'));
            }
        })),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    check('phone')
        .optional()
        .custom((val) => {
            if (!val.startsWith('05')) {
                throw new Error('Phone Number Should Start with: 05');
            } else if (val.length !== 10) {
                throw new Error('Phone Number Should be Exactly 10 Characters Long');
            }else{return true}}),

    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  check('name')
    .optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
        .notEmpty().withMessage('User Email Required')
        .isEmail().withMessage('Invalid Email Address')
        .custom((val) =>
        User.findOne({ email: val }).then((user) => {
            if (user) {
            return Promise.reject(new Error('E-mail already in use'));
            }
        })),
        check('phone')
        .optional()
        .custom((val) => {
            if (!val.startsWith('05')) {
                throw new Error('Phone Number Should Start with: 05');
            } else if (val.length !== 10) {
                throw new Error('Phone Number Should be Exactly 10 Characters Long');
            }else{return true}}),
    check('profileImg').optional(),
    check('role').optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('currentPassword')
        .notEmpty()
        .withMessage('You must enter your currnet password '),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter the password confirm'),
    body('password')
        .notEmpty()
        .withMessage('You must enter new password')
        .custom(async(val, { req }) => {
            const user=await User.findById(req.params.id);
            if(!user){
                throw new Error("There is no user for this id ")
            }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword,user.password)
            if(!isCorrectPassword){
                throw new Error("Plz enter the current password correctly ")
            }
            if (val !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }}),
    validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
    check('name')
      .optional()
      .custom((val, { req }) => {
          req.body.slug = slugify(val);
          return true;
      }),
      check('email')
          .notEmpty().withMessage('User Email Required')
          .isEmail().withMessage('Invalid Email Address')
          .custom((val) =>
          User.findOne({ email: val }).then((user) => {
              if (user) {
              return Promise.reject(new Error('E-mail already in use'));
              }
          })),
          check('phone')
          .optional()
          .custom((val) => {
              if (!val.startsWith('05')) {
                  throw new Error('Phone Number Should Start with: 05');
              } else if (val.length !== 10) {
                  throw new Error('Phone Number Should be Exactly 10 Characters Long');
              }else{return true}}),
    validatorMiddleware,
  ];
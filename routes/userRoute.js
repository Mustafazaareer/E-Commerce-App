const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getPersonalInfo,
  updateloggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require('../services/userService');
const authService=require('../services/authService')


const router = express.Router();



router
.route('/changeMyPassword')
.put(authService.protect,updateloggedUserPassword)

router
.route('/updateMe')
.put(authService.protect,updateLoggedUserValidator,updateLoggedUserData)

router
.route('/deleteMe')
.delete(authService.protect,deleteLoggedUserData)

router
.route('/getPersonalInfo')
.get(authService.protect,getPersonalInfo,getUser)

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route('/')
  .get(
    authService.protect,
    authService.allowedTo('admin','manager'),
    getUsers)
  .post(
    authService.protect,
    authService.allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser);
router
  .route('/:id')
  .get(
    authService.protect,
    authService.allowedTo('admin'),
    getUserValidator,
    getUser)
  .put(authService.protect,
    authService.allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser)
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteUserValidator,
    deleteUser);


module.exports = router;
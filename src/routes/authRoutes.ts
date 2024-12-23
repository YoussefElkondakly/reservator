//in this page we will make some things like the userLogin read and update 

import { Router } from "express";
import { login ,editProfile,profile,logout,changePassword,forgetPassword, resetPassword} from "../controller/authController";
import {
  validateLogin,
  validateEditProfile,
  validateUpdatePassword,
  validateResetPassword,
} from "../validations/authValidations";
import { checkIfPasswordUpdated, protect, requirePasswordUpdate } from "../controller/accessController";

const router=Router()
router.post("/login", validateLogin, requirePasswordUpdate, login);
router.post(
  "/updatePassword",
  validateUpdatePassword,
  checkIfPasswordUpdated,
  changePassword
);
router.post('/forgetPassword',forgetPassword)
router.post('/resetpassword/:code',validateResetPassword,resetPassword)
router.use(protect)
router.patch('/profile',validateEditProfile,editProfile)
router.get('/profile',profile)
router.get('/logout',logout)
export default router
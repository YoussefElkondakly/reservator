//in this page we will make some things like the userLogin read and update 

import { Router } from "express";
import { login ,editProfile
,profile
,logout,
changePassword} from "../controller/authController";
import {
  validateLogin,
  validateEditProfile,
  validateUpdatePassword,
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
// router.post('/forgetPassword') I will Contact Hafez to make a reliable Mail sending technique
router.use(protect)
router.patch('/profile',validateEditProfile,editProfile)
router.get('/profile',profile)
router.get('/logout',logout)
export default router
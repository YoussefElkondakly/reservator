import { Router } from "express";
import {  addDepartment, addDoctor, signupAdmin } from "../controller/adminController";
import { validateMakeAdmin, validateMakeUser } from "../validations/adminValidations";
import { authGuard, checkAdminBeforeMakeOne, protect } from "../controller/accessController";

const router=Router()
//ONLY EXECUTED ONCE
router.post('/admin',validateMakeAdmin,checkAdminBeforeMakeOne,signupAdmin)
router.use(protect)
router.post('/admin/addDoctor',authGuard('admin'),validateMakeUser,addDoctor)
router.post("/admin/addDepartment", authGuard("admin"), addDepartment);


//Route for Adding a doctor to the system (like signing up the doctor)

export default router
import AppError from "../util/appError";
import Password from "../util/passwordManagement";
import Users from "../model/usersModel";
import Departments from "../model/departmentsModel";
import catchAsync from "../util/catchAsync";
import { sendJsonResponseToken } from "./accessController";

export const signupAdmin = catchAsync(
  async (req, res, next) => {
if(!req.body)return next (new AppError("Please provide all required fields", 400))
const pass=new Password()
pass.set(req.body.password)
req.body.password=await pass.hashPassword()
const admin =await Users.create(req.body)
if(!admin)return next(new AppError("there is a problem creating admin",400))
sendJsonResponseToken(admin.id,201,res)
  }
);

export const addDoctor=catchAsync(async (req,res,next)=>{ 
const pass=new Password()
pass.set(req.body.password)
req.body.password=await pass.hashPassword()
const user=await Users.create(req.body)
if(!user)return next(new AppError("there is a problem creating doctor",400))
  res.status(201).json({
status: "Doctor Created Successfully",
data: user
  })
})

export const addDepartment = catchAsync(async (req, res, next) => {
const department=await Departments.create(req.body)
if(!department)return next(new AppError("there is a problem creating department",400))
  res.status(201).json({
status: "Department Created Successfully",
data: department
})
});


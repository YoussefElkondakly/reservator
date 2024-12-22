import Joi from "joi";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import validator from "validator";

const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
})
export const validateLogin=catchAsync(async(req,res,next)=>{
    const data=await loginSchema.validateAsync(req.body);
req.body=data
    next();
})
const editProfileSchema=Joi.object({
    name:Joi.string(),
    email:Joi.string().email(),
    phone: Joi.string()
    .custom((val, helper) => {
      if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
        return helper.error("any.invalid", {
          message: "incorrect phone number",
        });
      }
      return val;
    }, "This message for you"),address:Joi.string()
    
})
export const validateEditProfile=catchAsync(async(req,res,next)=>{
    const data=await editProfileSchema.validateAsync(req.body);
    req.body=data
    next();
});
const updatePasswordSchema = Joi.object({

  email: Joi.string().email().required(),
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("newPassword"),
});
export const validateUpdatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.passwordConfirm) {
    return next(new AppError("You need to Confirm password", 403));
  }
  const value = await updatePasswordSchema.validateAsync(req.body);
  
  req.body = value;
  next();
});
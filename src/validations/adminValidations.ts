import Joi from 'joi'
import AppError from '../util/appError';
import catchAsync from '../util/catchAsync';
import validator from 'validator'
const makeAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  role:'admin',
});
const makeDoctorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone:Joi.string()
    .custom((val, helper) => {
      if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
        return helper.error("any.invalid", {
          message: "incorrect phone number you must add +2",
        });
      }
      return val;
    }, "This message for you").required(),
  specialty:Joi.string().required(),
  address:Joi.string().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  employee_limit:Joi.number().required()
});
export const validateMakeAdmin=catchAsync(async(req,res,next)=>{
      if (!req.body.passwordConfirm) {
        return next(new AppError("You need to Confirm password", 403));
      }
      const value = await makeAdminSchema.validateAsync(req.body);
      value.role='admin'
      req.body = value;
      next();

})
export const validateMakeUser=catchAsync(async(req,res,next)=>{
  if (!req.body.passwordConfirm) {
    return next(new AppError("You need to Confirm password", 403));
  }
  const value = await makeDoctorSchema.validateAsync(req.body);
const   role =req.originalUrl.split('/')
  if(role[3]==='addDoctor'){
    value.role='doctor'
  }
  if(role[3]==='addSecretary'){
    value.specialty=null
    value.role='secretary'
  }
  req.body = value;
  next();
})

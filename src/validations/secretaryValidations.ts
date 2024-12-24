import Joi from "joi";
import validator from "validator";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";

/*
nationalId
name
phone
address
email
gender
job
has_insurance
*/
const addPatientSchema = Joi.object({
  nationalId: Joi.string()
    .length(14)
    .pattern(/^[1-9][0-9]{13}$/)
    .required(),
    nationalIdConfirm:Joi.ref('nationalId'),
  name: Joi.string().required(),
  phone: Joi.string().custom((val, helper) => {
    if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
      return helper.error("any.invalid", {
        message: "incorrect phone number",
      });
    }
    return val;
  }, "This message for you").required(),
  address: Joi.string().required(),
  email: Joi.string().email(),
  gender: Joi.string().valid("male", "female").required(),
  job: Joi.string().required(),
  has_insurance: Joi.boolean().required(),
});
const updatePatientSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string().custom((val, helper) => {
    if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
      return helper.error("any.invalid", {
        message: "incorrect phone number",
      });
    }
    return val;
  }, "This message for you"),
  address: Joi.string(),
  email: Joi.string().email(),
  job: Joi.string(),
  has_insurance: Joi.boolean(),
});
export const validateAddPatient=catchAsync(async (req, res, next) => {
if (Object.values(req.body)[0] === undefined)
  return next(new AppError("there is nothing to add", 400));    
    const value = await addPatientSchema.validateAsync(req.body);
    req.body=value
    next()
})
export const validateUpdatePatient=catchAsync(async (req, res, next) => {
if (Object.values(req.body)[0] === undefined)
  return next(new AppError("there is nothing to add", 400));    
    const value = await updatePatientSchema.validateAsync(req.body);
    req.body=value
    next()
})

const makeReservationSchema = Joi.object({
  nationalId: Joi.string()
    .length(14)
    .pattern(/^[1-9][0-9]{13}$/)
    .required(),
    date_time:Joi.date().greater('now').iso().required(),
duration:Joi.number().integer().min(10).max(120).required(),
});
export const validateMakeReservation=catchAsync(async (req,res,next)=>{
  if (Object.values(req.body)[0] === undefined)
    return next(new AppError("there is nothing to add", 400));
  const value = await makeReservationSchema.validateAsync(req.body);
  req.body=value
  next()
});
const makePaymentSchema = Joi.object({
  
  payment_amount:Joi.number().required()
});
export const validateMakePayment=catchAsync(async (req,res,next)=>{
  if (Object.values(req.body)[0] === undefined)
    return next(new AppError("there is nothing to add", 400));
  const value = await makePaymentSchema.validateAsync(req.body);
  
  req.body=value
  next()
  })
import { updateAvailability } from "./../controller/doctorController";
import Joi from "joi";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
/**
 * week_day
start_time
end_time
 */
const makeAvailabilitySchema = Joi.object({
  week_day: Joi.string()
    .lowercase()
    .valid(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    )
    .required(),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
}).custom((value, helpers) => {
  const start = value.start_time;
  const end = value.end_time;

  // Convert time strings to comparable date objects
  const startDate = new Date(`1970-01-01T${start}:00`);
  const endDate = new Date(`1970-01-01T${end}:00`);

  if (startDate >= endDate) {
    return helpers.error("any.custom", {
      message: "Start time must be earlier than end time",
    });
  }

  return value; // Return value if validation passes
});
const updateAvailabilitySchema = Joi.object({
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
}).custom((value, helpers) => {
  const start = value.start_time;
  const end = value.end_time;

  // Convert time strings to comparable date objects
  const startDate = new Date(`1970-01-01T${start}:00`);
  const endDate = new Date(`1970-01-01T${end}:00`);

  if (startDate >= endDate) {
    return helpers.error("any.custom", {
      message: "Start time must be earlier than end time",
    });
  }

  return value; // Return value if validation passes
});
export const validateUpdateAvailability = catchAsync(async (req, res, next) => {
  if (Object.values(req.body)[0] === undefined)
    return next(new AppError("there is nothing to add", 400));
  const value = await updateAvailabilitySchema.validateAsync(req.body);
  req.body = value;
  next();
});
export const validateMakeAvailability = catchAsync(async (req, res, next) => {
  if (Object.values(req.body)[0] === undefined)
    return next(new AppError("there is nothing to add", 400));
  const value = await makeAvailabilitySchema.validateAsync(req.body);
  value.active = 1;
  req.body = value;
  next();
});
const checkOutSchema = Joi.object({

  complaint: Joi.string().required(),
  diagnosis: Joi.string().required(),
  prescribed_medicine: Joi.string().required(),
});
export const validateCheckOut = catchAsync(async (req, res, next) => {
  if (Object.values(req.body)[0] === undefined)
    return next(new AppError("there is nothing to add", 400));
  const value = await checkOutSchema.validateAsync(req.body);
  req.body = value;
  next();
});

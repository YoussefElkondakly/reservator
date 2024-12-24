//adds patient's CRM 
//order the reservation table for doctor and Enhance them correctly 

import { invalid } from "joi";
import Availabilities from "../model/availabilitiesModel";
import Patients from "../model/patientsModel";
import Reservations from "../model/reservationsModel";
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";
import { compareTime } from "../util/compareTime";
import Payments from "../model/paymentsModel";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
//make payments take payments and so on 
export const addPatient=catchAsync(async (req,res,next)=>{
    if (!req.user) return next(new AppError("User not found", 404));
    const patient=await  req.user.createPatient(req.body)
    if(!patient)return next(new AppError("There is a Problem creating a crm",403))
      const medicalRecord=await patient.createMedicalRecords()
    res.status(201).json({status:"success",data:patient})
})
export const makeReservation = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not found", 404));
  const employer=req.user.supervised_by
  const weekDay = days[new Date(req.body.date_time).getDay()];console.log(weekDay,employer);
  const patient = await Patients.findOne({
    where: { nationalId: req.body.nationalId },
  }) ;
    if (!patient)return next(new AppError("Patient not found please check the national Id or Add Patient", 403));
//check avialbility with day
const availability=await Availabilities.findOne({where:{
    doctor_id:employer,week_day:weekDay.toLowerCase()
}})
if(!availability)return next(new AppError("Doctor is not available on this day",403))
if(!compareTime(availability.start_time,availability.end_time,req.body.date_time,req.body.duration))return next(new AppError("invalid Time",400))

    const reservation = await patient.createReservation({
        date_time: req.body.date_time,
        duration: req.body.duration,
        doctor_id: employer,
    });
    //TODO Middle ware to prevent the duplicate reservations
  res.status(201).json({ status: "Reserved", data: reservation });
});
export const patient=catchAsync(async(req,res,next)=>{
  if (!req.user) return next(new AppError("User not found", 404));
  const patientId=req.params.id
  const patient=await Patients.findOne({where:{id:patientId}})
      if(!patient)return next(new AppError("Patient not found",404))
res.status(200).json({
  status:"success",
  data:patient
})
})
export const patients=catchAsync(async(req,res,next)=>{
  if (!req.user) return next(new AppError("User not found", 404));
  const patients= await req.user.getPatients();
  if (patients.length === 0) return next( new AppError("You don't added any patients please add some", 400));
res.status(200).json({
  status: "Success",
  data: patients,
})
 
})
export const checkOwnership=catchAsync(async(req,res,next)=>{
  const patientId=req.params.id
  const patient=await Patients.findOne({where:{id:patientId}})
  if(!patient)return next(new AppError("Patient not found",404))
    if(!(patient.user_id===req.user.id)){
      return next(new AppError("Cannot access this patient",403))
    }
    next()
})
export const updatePatient=catchAsync(async(req,res,next)=>{
  const patientId=req.params.id
  const patient = await Patients.update(req.body,{ where: { id: patientId } ,returning:true});
  if (!patient) return next(new AppError("Patient not found", 404));
  res.status(200).json({ status: "success", data: patient });
})
export const makePayment = catchAsync(async (req, res, next) => {
  const reservation_id = req.params.reservationId;
  const reservation=await Reservations.findByPk(reservation_id)
  if(!reservation)return next(new AppError("There is no reservation with specified Id",400))
  req.body.doctor_id=req.user.supervised_by
  req.body.payment_date=new Date();
  const payment =await reservation.createPayments(req.body)
  if (!payment) return next(new AppError("Payment not made", 404));
  res.status(201).json({ status: "Payment made", data: payment });
});
export const payments = catchAsync(async (req, res, next) => {
  const payments=await Payments.findAll({where:{doctor_id:req.user.supervised_by}})
  if(payments.length===0)return next(new AppError("There is now payments made untill now",400))
    res.status(200).json({ status: "success", data: payments });
});

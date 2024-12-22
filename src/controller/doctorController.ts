import { array } from 'joi';
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";
import Password from "../util/passwordManagement";
import Availabilities from '../model/availabilitiesModel';
import Reservations from '../model/reservationsModel';
import Patients from '../model/patientsModel';
import MedicalRecords from '../model/medicalRecordsModel';

//ADD Secrtary 
export const addSecretary =catchAsync(async(req,res,next)=>{
if(!req.user)return next(new AppError("User not found",404))
    const pass = new Password();
    pass.set(req.body.password);
    req.body.password = await pass.hashPassword();

    const secretary = await req.user.createUser(req.body);
    if (!secretary)
      return next(new AppError("there is a problem creating Secretary", 400));
    res.status(201).json({
      status: "Secretary Created Successfully",
      data: secretary,
    });
})
export const addAvailability=catchAsync(async(req,res,next)=>{
    const availability = await req.user.createAvailability(req.body);
if(!availability)return next(new AppError("There is a Problem",404))
    res.status(201).json({
status: "Availability Created Successfully",
data: availability,
})
})
export const checkAvailabilityTable=catchAsync(async(req,res,next)=>{
  const availabilities=await req.user.getAvailabilities() ;
  if(availabilities.length===0)return next()
    availabilities.forEach((el:Availabilities,)=>{
  if(el.week_day === req.body.week_day)return next(new AppError("You can't add the weekDay twice please update your availability table",400));
})
next()
})
export const getAvailabilities=catchAsync(async (req,res,next)=>{
  const availabilities = await req.user.getAvailabilities();
  if (availabilities.length === 0) return next(new AppError("You don't added any availability please add some",403));
res.status(200).json({
  status: "Success",
  data: availabilities,
})
})
export const getAvailability = catchAsync(async (req, res, next) => {
  
  const availability = await Availabilities.findOne( {
    where: { id: req.params.id, doctor_id: req.user.id },
  });
  if(!availability)return next(new AppError("please provide a correct availability",400))
    res.status(200).json({
  status: "Success",
      data: availability,
    });
});
export const updateAvailability=catchAsync(async (req,res,next)=>{
if (Object.values(req.body)[0] === undefined)
  return next(new AppError("there is nothing to update", 400));    
const updateAvailability=await Availabilities.update(req.body,{where:{id:req.params.id,
  doctor_id:req.user.id
},returning:true},)
res.status(200).json({
  status: "Availability Updated Successfully",
  data:updateAvailability
})
})
export const changeStatus=catchAsync(async (req,res,next)=>{
  const availability = await Availabilities.findOne( {
    where: { id: req.params.id, doctor_id: req.user.id },
  });
  if(!availability)return next(new AppError("please provide a correct availability",400))
    availability.active=!availability.active
 await availability.save()
  res.status(200).json({
    status: "Availability Updated Successfully",
    data: updateAvailability,
  });
})
//set time table 
//see incoming patients 
//finish medical record with the checkout visit 
export const getReservations=catchAsync(async(req,res,next)=>{
  const reservations = await Reservations.findAll({
    where: { doctor_id: req.user.id },
   attributes: ['id',"date_time", "duration", "completed"],
    include: {
      model: Patients,
      attributes: ["name", "phone"],
    },
  });
  if(reservations.length===0)return next(new AppError("There is no reservations at this moment",400))
    res.status(200).json({
  status: "Success",
  data: reservations,
  })
});
export const getReservation=catchAsync(async(req,res,next)=>{
  const reservation=await Reservations.findOne({
    where:{doctor_id:req.user.id,id:req.params.id},
    attributes:[
'date_time',
'duration',
      'completed',
    ],
    include:{
      model:Patients,
      attributes:{exclude:['createdAt','updatedAt']}
    }
  })
  if(!reservation)return next(new AppError("There is no reservations at this moment",400))
    res.status(200).json({
  status: "Success",
  data: reservation,
  })
});
export const checkOut = catchAsync(async (req, res, next) => {
  //you have the reservation Id not the patient Id 
  const reservation = await Reservations.findOne({ where: { id: req.params.id } });
  if (!reservation) return next(new AppError("Reservation does not exist", 404));
  if(reservation.completed)return next(new AppError("The provided Reservation Has Been checked Out recently",400))
  reservation.completed=true
  await reservation.save()
  // const reservation=await Reservations.update({completed:true},{where:{patient_id}})
  const medicalRecord=await MedicalRecords.findOne({where:{patient_id:reservation.patient_id}})
  if(!medicalRecord)return next(new AppError("Medical record does not exist",404))
    req.body.patient_id = reservation.patient_id;
req.body.medicalRecord_id=medicalRecord.id
    req.body.last_visit=new Date()
    const checkOut=await req.user.createVisitHistory(req.body)
    if(!checkOut)
      return next(new AppError("Failed to create visit history",500))
    res.status(200).json({
      status: "Success",
      data: checkOut,
    })
});


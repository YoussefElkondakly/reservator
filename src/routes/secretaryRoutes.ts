import { Request, Response, Router } from "express";
import { authGuard, protect } from "../controller/accessController";
import { addPatient, makeReservation ,patient,checkOwnership,updatePatient,patients} from "../controller/secretaryController";
import { validateAddPatient, validateMakeReservation, validateUpdatePatient } from "../validations/secretaryValidations";

const router=Router()
router.use(protect,authGuard('secretary'))
//TODO validation Ya JO FIXME
//TODO make sure secretary belongs to the doctor that has the patient 
router.post('/addPatient',validateAddPatient,addPatient)
//read patient

router.get('/patient/:id',checkOwnership,patient)
router.get('/patients',patients)
//update patient 
router.patch("/patient/:id", checkOwnership,validateUpdatePatient, updatePatient);

/* 
make reservation for patient we need To make sevreal middlewares in this thing
patient_id
doctor_id==>supervised by 
datetime duration 
make A middle ware comparing time that the doctor added with the availability table 
sunday->6:12
datetime 25-12-2024 6:30 tsz to timeStamp 1536845136

Hellloooo Rahma 

*/
//Secrtary supervised_by national Id => go find and return then make the reservation linking the patient 

router.post("/makeReservation",validateMakeReservation,,makeReservation);

export default router
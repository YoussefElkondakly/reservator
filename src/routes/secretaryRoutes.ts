import { Request, Response, Router } from "express";
import { authGuard, protect } from "../controller/accessController";
import { addPatient, makeReservation ,patient,checkOwnership,updatePatient,patients, makePayment} from "../controller/secretaryController";
import { validateAddPatient, validateMakePayment, validateMakeReservation, validateUpdatePatient } from "../validations/secretaryValidations";

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


router.post("/makeReservation",validateMakeReservation,makeReservation);
router.post('/makePayment/:reservationId',validateMakePayment,makePayment)
export default router
import { Router } from "express";
import { authGuard, checkEmployee, protect } from "../controller/accessController";
import {
  addAvailability,
  addSecretary,
  checkAvailabilityTable,
  getAvailabilities,
  updateAvailability,
  changeStatus,
  getAvailability,
  getReservations,
  getReservation,
  checkOut,
} from "../controller/doctorController";
import { validateMakeUser } from "../validations/adminValidations";
import {
  validateCheckOut,
  validateMakeAvailability,
  validateUpdateAvailability,
} from "../validations/doctorValidations";

const router=Router()
router.use(protect,authGuard('doctor'))
router.post("/addSecretary", checkEmployee, validateMakeUser, addSecretary);

router.post('/addAvailability',validateMakeAvailability,checkAvailabilityTable,addAvailability)
router.get('/availabilities',getAvailabilities)
router.get('/availabilities/:id',getAvailability)
router.patch(
  "/availabilities/:id",
  validateUpdateAvailability,
  updateAvailability
);
router.post('/availabilities/:id',changeStatus)
//--------------------------checkpayments get mounthly weekly income ----------//
router.get('/reservations',getReservations)
router.get("/reservations/:id", getReservation);

router.post('/reservations/:id/checkOut',validateCheckOut,checkOut)
export default router
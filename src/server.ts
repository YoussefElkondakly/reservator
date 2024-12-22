import app from "./app"
import { config } from "dotenv"
import { Sequelize } from "sequelize-typescript";
import Users from "./model/usersModel";
import Patients from "./model/patientsModel";
import Availabilities from "./model/availabilitiesModel";
import Reservations from "./model/reservationsModel";
import VisitHistories from "./model/visitHistoriesModel";
import MedicalRecords from "./model/medicalRecordsModel";
import Departments from "./model/departmentsModel";

config()
const dbpassword=process.env.DB_PASSWORD||''
const dbhost=typeof process.env.DB_HOST==='string'?process.env.DB_HOST.replace('<PASSWORD>',dbpassword) :""  
const port=process.env.PORT
const sequelize=new Sequelize(dbhost,{
  logging:false
})
sequelize.addModels([
  Users,
  Patients,
  Availabilities,
  Reservations,
  VisitHistories,MedicalRecords,Departments
]);
sequelize.sync(
// {force: true}
).then(()=>{
    console.log("connected")
    app.listen(port, () => {
      console.log("server is running");
    });
}).catch(e=>console.log(e))
export {sequelize}


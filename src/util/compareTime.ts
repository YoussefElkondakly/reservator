import { NextFunction } from 'express';
import AppError from './appError';
export const compareTime=function(startTime:string,endTime:string,givenTime:Date,duration:number=30){
  
       const fullTime=givenTime.setMinutes(givenTime.getMinutes()+duration)
       console.log("Current : ",new Date(fullTime));
       
let today=new Date().toISOString().split('T')[0]
if(givenTime>new Date()){
    console.log("Time is future");
today=givenTime.toISOString().split('T')[0]
}
const  startDate = new Date(`${today}T${startTime}`);
const endDate = new Date(`${today}T${endTime}`);
startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
console.log("newDate:::",new Date());
console.log("start :   ",startDate);
console.log("end ::::::",endDate);

if(!(startDate<=givenTime&&givenTime<=endDate))return false

    return true
}
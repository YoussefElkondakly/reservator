import express from "express";
import secretaryRoutes from "./routes/secretaryRoutes";
import adminRoutes from "./routes/adminRoutes"
import AppError from "./util/appError";
import { errorHandler } from "./util/errorHandler";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
const app=express()
app.use(express.json())
const baseurl="/reservator"
// app.use(baseurl)
app.use(baseurl+'/auth',authRoutes)
app.use(baseurl, adminRoutes);
app.use(baseurl+ "/doctor", doctorRoutes);
app.use(baseurl+"/secretary", secretaryRoutes);
app.all('*',(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const err=new AppError("this provided url "+req.originalUrl+" is not in the server",404)
    next(err)
})
app.use(errorHandler)
export default app
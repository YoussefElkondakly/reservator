import { NextFunction, Request, Response } from "express";
import AppError from "./appError";

export const errorHandler=(err:AppError,
    req:Request,res:Response,next:NextFunction
)=>{
    // TODO in remember to handel errors in the production mode 
err.statusCode=err.statusCode||500
// err.status=err.status||""
err.message = err.message || "internal server error";
res.status(err.statusCode).json({
    status:err.status,
    message:err.message,
    error:err
})

}
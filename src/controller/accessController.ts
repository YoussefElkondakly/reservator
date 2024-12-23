import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import Users from "../model/usersModel";
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";
import UserHandler from "../util/userHandler";

export const protect=catchAsync(async (req,res,next)=>{
    if(!req.headers.authorization||!(req.headers.authorization.split(' ')[0]==='Bearer')){return next(new AppError("Sorry you are not logged in please login", 400));}
// if(!req.user)return next(new AppError("Sorry you are not logged in please login",400))
const token = req.headers.authorization.split(" ")[1];

if(token==="null")return next(new AppError('you are not logged in please login correctly',400))
 const payload=await verify(token,process.env.JWT_SECRET!) as JwtPayload
const id =payload.userId
const user = await Users.findByPk(id, {
  attributes: ['id',
    "name",
    "email",
    "phone",
    "role",
    "specialty",
    "createdAt",
    "updatedAt",
    "supervised_by",
    "passwordChangedAt",
    'employee_limit'
  ],
});
if(!user)return next(new AppError("Incorrect user or token",400))
    
    const userHandler = new UserHandler();
    userHandler.user = user;
    if (userHandler.checkChangedPassword(payload.iat!, user.passwordChangedAt))
      return next(
        new AppError(
          "It seemed That You changed The Password After logging in please login again",
          404
        )
      );
      
    req.user = user;
    next();
})
export const authGuard =function(role:string){
    return (req:Request,res:Response,next:NextFunction)=>{
    if(!req.user)return next(new AppError("Please Login",400))
    if(!(req.user.role===role))return next(new AppError("Access Denied",401))
next();
    }
};
export const sendJsonResponseToken = function (
    userId: number,
    status: number,
    res: Response
) {
    const token = sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_DURATION,
});
res.status(status).json({
    status: "success",
    token,
});
};
export const checkAdminBeforeMakeOne=catchAsync(async (req,res,next)=>{
    //
const user=await Users.findOne({where:{role:'admin'}})
if(user)return next(new AppError("There is already a signed Admin",400))
    next()
})


export const requirePasswordUpdate=catchAsync(async (req,res,next)=>{
  const user=await Users.findOne({where:{email:req.body.email}})
  if(!user) return next(new AppError("User not found",404,))
    if (user.role === "admin" || user.role === "secretary") return next();
// console.log(user.createdAt*1 === user.updatedAt*1);
// console.log(user.passwordChangedAt===null);
if((user.createdAt*1===user.updatedAt*1)||(user.passwordChangedAt===null))return next(new AppError("please Update password before logging in",400))
next()
});

export const checkIfPasswordUpdated = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ where: { email: req.body.email } });
  if (!user) return next(new AppError("User not found", 404));
  if (user.role === "admin"|| user.role === "secretary") return next();

  //       f     f
  if (!(user.createdAt*1 === user.updatedAt*1) || !(user.passwordChangedAt === null))
    return next(new AppError("You can't continue to this route anymore", 400));
  next();
});

export const checkEmployee=catchAsync(async (req,res,next)=>{
const employeeLimit:number=req.user.employee_limit
//employeelimit =2
//find in database the number of assoiated created user
const getEmployee=await Users.findAll({where:{supervised_by:req.user.id}})

// console.log(getEmployee,employeeLimit);
// console.log(getEmployee.length===employeeLimit);
if(getEmployee.length<=employeeLimit)return next(new AppError("You have reached your employee limit",400))
next()

})
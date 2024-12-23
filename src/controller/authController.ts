import { Request, RequestHandler } from "express";
import Users from "../model/usersModel";
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";
import Password from "../util/passwordManagement";
import UserHandler from "../util/userHandler";
import { sendJsonResponseToken } from "./accessController";
import { sendEmail } from "../util/emailSender";
import Crypto from "crypto";
import { Op } from "sequelize";

const createHashedToken = function (urlToken: string) {
  return Crypto.createHash("sha256").update(urlToken).digest("hex");
};
const createMailToken = async function (userHandler: UserHandler,request: Request,) {
  const verifyCode = userHandler.createToken();
  await userHandler.save();
  const verifyURL = `${request.protocol}://${request.get(
    "host"
  )}/reservator/auth/resetpassword/${verifyCode}`;
  const body = `Hello 
  Your Password Reset Link is: ${verifyURL}
  Reservator Company...`;
  try {
    await sendEmail(
       userHandler.user.email,
       `Reset Password`,
      body,
    );
  } catch (err) {
    
      userHandler.user.passwordResetToken = null;
      userHandler.user.passwordResetExpires = null;
    await userHandler.save();
    return new AppError(
      "There was an error sending the verification email. Please try again later",
      500
    );
  }}
//Login
export const login=catchAsync( async(req,res,next)=>{
const user=await Users.findOne({where:{email:req.body.email}});
if(!user)return next(new AppError("Invalid email or password",401));
const pass=new Password()
const checkPassword =await pass.comparePassword(req.body.password,user.password)
if(!checkPassword)return next(new AppError("Invalid email or password",401));
sendJsonResponseToken(user.id,200,res)

})
export const changePassword=catchAsync(async(req,res,next)=>{
    const user=await Users.findOne({where:{email:req.body.email}})
    if(!user)return next(new AppError('user Not found',404))
     const pass=new Password()
    const checkPassword=await pass.comparePassword(req.body.oldPassword,user.password)
    if(!checkPassword)return next(new AppError('Invalid old password',401))
        pass.set(req.body.newPassword)
    req.body.newPassword=await pass.hashPassword()
user.password=req.body.newPassword
user.passwordChangedAt = new Date(Date.now() - 1000);
await user.save()
res.status(200).json({
    status:'success',
    message:'password changed successfully Please LogIn',
})
})
export const editProfile=catchAsync(async(req,res,next)=>{    
if(Object.values(req.body)[0]===undefined)return next(new AppError("there is nothing to update",400))    
    const user=await Users.update(req.body,{where:{id:req.user.id},returning:[
'name',
'email',
'specialty',
'role',
        'phone',
    ]})
    if(!user[0])return next(new AppError("there is A problem updating user",400))
    res.status(200).json({status:"success",data:user})
})
export const profile=catchAsync(async(req,res,next)=>{
    console.log(req.user);
    
    const user=await Users.findOne({where:{id:req.user.id},attributes:['name','email','specialty','role','phone']})
      if(!user)return next(new AppError("there is A problem",400))  
    res.status(200).json({status:"success",data:user})

        
})

export const forgetPassword=catchAsync(async (req,res,next)=>{
    if (Object.values(req.body)[0] === undefined)return next(new AppError("Please enter you email address", 400));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(req.body.email))return next(new AppError("Please enter a correct email",400))
   const user =await Users.findOne({where:{email:req.body.email}})
if(!user)return next(new AppError("User with the provided e-mail is not found",400))
// create hash and then sends it to the email      
const userHandler=new UserHandler()
userHandler.user=user
await createMailToken(userHandler,req)
res.status(201).json({
    status: "success",
    message: "Token sent to your email please check your email",
  });
})
export const resetPassword = catchAsync(async (req, res, next) => {
  const receivedToken = req.params.code;
  const userToken = createHashedToken(receivedToken);
  const user = await Users.findOne({
    where: {    
      passwordResetToken: userToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  // console.log(user[0])
  if (!user) return next(new AppError("User not found ", 404));
  if (!user.passwordResetExpires)
    return next(new AppError("Prop line 194", 404));
  if (!(new Date(user.passwordResetExpires).getTime() > Date.now()))
    return next(
      new AppError(
        "Password Reset Token Has Expired please send another request",
        400
      )
    ); //send error
    const pass=new Password()
    pass.set(req.body.password);
    req.body.password = await pass.hashPassword();
  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.passwordChangedAt = new Date(Date.now() - 1000);
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Password Rested Successfully please login",
  });
});

export const logout: RequestHandler = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
};

//FORGET PASSWORD 
//ENTER EMAIL 
//CHECK EMAIL
//SEND THE STATUS THAT THE RESET PASSWORD CODE HAS SENT TO THE EMAIL AND CHECK YOUR MAIL TO RESET THE PASSWORD 
//COMPARE THE RESET CODE 
//ENTER THE NEW PASSWORD 
//REENTER IT 
//UPDATE THE PASSWORD CHANGED AT FIELD 
//DN

//TODOforgetPassword
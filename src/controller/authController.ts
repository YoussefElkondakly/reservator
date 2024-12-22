import Users from "../model/usersModel";
import AppError from "../util/appError";
import catchAsync from "../util/catchAsync";
import Password from "../util/passwordManagement";
import { sendJsonResponseToken } from "./accessController";

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
export const logout=catchAsync(async(req,res,next)=>{})
//getProfile
//editProfile
//logout


//TODOforgetPassword
import { Request } from "express";
import Users from "../model/usersModel";
declare global  {
  namespace Express {
  interface Request {
    user: User|null;
  }
}}
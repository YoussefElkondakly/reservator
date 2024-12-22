import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Users from "./usersModel";

@Table
export default class Payments extends Model{
@ForeignKey(()=>Users)
@Column
doctor_id!:number   
@Column
patient_id!:number   
@Column
payment_date!:number   
    @Column
   payment_amount!:number   
   @BelongsTo(()=>Users)
   user!:Users
}
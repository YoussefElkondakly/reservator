import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Users from "./usersModel";

@Table
export default class VisitHistories extends Model {
@Column
patient_id!:number
 @Column
medicalRecord_id!:number
@ForeignKey(()=>Users)
     @Column 
    doctor_id!:number
@Column
complaint!:string
 @Column
 diagnosis!:string   
@Column
prescribed_medicine!:string

@Column
last_visit!:Date

@BelongsTo(()=>Users)
users!:Users
}
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Users from "./usersModel";
@Table
export default class Availabilities extends Model{
@Column
week_day!:string
    @Column
start_time!:string
@Column
end_time!:string
    @ForeignKey(()=>Users)
    @Column
    doctor_id!:number
    @Column
    active!:boolean
@BelongsTo(()=>Users)
user!:Users
}; 
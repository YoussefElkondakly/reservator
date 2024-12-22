import { patient } from './../controller/secretaryController';
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Patients from "./patientsModel";

@Table
export default class MedicalRecords extends Model{
@ForeignKey(()=>Patients)
@Column
patient_id!: number;

@BelongsTo(()=>Patients)
patients!:Patients
}
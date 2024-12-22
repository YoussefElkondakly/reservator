import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Patients from "./patientsModel";
@Table
export default class Reservations extends Model {
  @Column
  guest_id!: number;
  @Column
  doctor_id!: number;
  @Column
  date_time!: Date;
  @Column
  duration!: number;
  @Column
  completed!:boolean;

  @ForeignKey(() => Patients)
  @Column
  patient_id!: number;

  @BelongsTo(() => Patients)/** */
  patients!: Patients;
}
/*
  include: [
      {
        model: User,
        attributes: ["name", "phone"],
      },
    ],
     */
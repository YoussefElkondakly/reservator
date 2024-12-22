/**
 * Table patients{
  id integer pk
  name varchar
  phone varchar
  address varchar
  email varchar
  gender varchar
  job varchar
  has_insurance bool
  created_at date
  user_id integer [ref: > users.id]
}
 */

import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, Table, Unique } from "sequelize-typescript";
import Users from "./usersModel";
import Reservations from "./reservationsModel";
import { HasManyCreateAssociationMixin } from "sequelize";
import MedicalRecords from "./medicalRecordsModel";

@Table
export default class Patients extends Model {
  @Unique
  @Column
  nationalId!: string;
  @Column
  name!: string;

  @Column
  phone!: string;

  @Column
  address!: string;

  @Column
  email!: string;

  @Column
  gender!: string;

  @Column
  job!: string;

  @Column
  has_insurance!: boolean;

  @ForeignKey(() => Users)
  @Column
  user_id!: number;

  @BelongsTo(() => Users)
  users!: Users;

  @HasMany(() => Reservations)
  reservations!: Reservations[];

  @HasOne(()=>MedicalRecords)
  medicalRecords!: MedicalRecords;
  
  createReservation!: HasManyCreateAssociationMixin<Reservations>;
}

import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import Patients from "./patientsModel";
import Payments from "./paymentsModel";
import { HasOneCreateAssociationMixin } from "sequelize";
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
  completed!: boolean;

  @ForeignKey(() => Patients)
  @Column
  patient_id!: number;

  @BelongsTo(() => Patients) /** */ patients!: Patients;

  @HasOne(() => Payments)
  payments!: Payments;

    createPayments!: HasOneCreateAssociationMixin<Payments>;
  
}
/*
  include: [
      {
        model: User,
        attributes: ["name", "phone"],
      },
    ],
     */
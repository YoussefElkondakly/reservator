import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Users from "./usersModel";
import Reservations from "./reservationsModel";

@Table
export default class Payments extends Model {
  @ForeignKey(() => Reservations)
  @Column
  reservation_id!: number;
  @Column
  doctor_id!: number;
  @Column
  payment_date!: Date;
  @Column
  payment_amount!: number;

  @BelongsTo(() => Reservations)
  reservation!: Reservations;
}

import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import Patients from "./patientsModel";
import Availabilities from "./availabilitiesModel";
import VisitHistories from "./visitHistoriesModel";
@Table
export default class Users extends Model {
  @AllowNull(false)
  @Column
  name!: string;
  @AllowNull(false)
  @Column
  email!: string;
  @AllowNull(false)
  @Column
  password!: string;
  @Column
  specialty!: string;
  @AllowNull(false)
  @Column
  role!: string;
  @Column
  phone!: string;
  @Column
  address!: string;
  @Column
  passwordChangedAt!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  passwordResetToken!: string | null;
  @Column({ type: DataType.DATE, allowNull: true })
  passwordResetExpires!: Date | null;
  //
  @Column
  employee_limit!: number;
  @HasMany(() => Patients)
  patients!: Patients[];

  // @HasMany(() => Users)
  // users!: Users[];

  // @ForeignKey(() => Users)
  // @Column
  // supervised_by!: number;
  // @BelongsTo(() => Users)
  // supervisor!: Users;
  @ForeignKey(() => Users)
  @Column
  supervised_by!: number;

  // The user belongs to another user who is their supervisor
  @BelongsTo(() => Users, "supervised_by")
  supervisor!: Users;

  // The user has many other users they supervise
  @HasMany(() => Users, "supervised_by")
  users!: Users[];
  @HasMany(() => Availabilities)
  availabilities!: Availabilities[];

  @HasMany(() => VisitHistories)
  visitHistories!: VisitHistories[];

  
}

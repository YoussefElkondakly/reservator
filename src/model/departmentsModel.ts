import { Column, Model, Table } from "sequelize-typescript";

@Table
export default class Departments extends Model{
    @Column
    name!:string
}
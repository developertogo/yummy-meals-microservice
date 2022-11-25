import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import { Users } from './users.model';
import {Meals} from './meals.model';
import {OrderAttributes} from './order-attributes.model';

@model({settings: {idInjection: false, mysql: {schema: 'yummy', table: 'orders'}}})
export class Orders extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mysql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'N', generated: 1},
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {columnName: 'user_id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'N', generated: 0},
  })
  userId: number;

  @property({
    type: 'date',
    required: true,
    generated: 0,
    mysql: {columnName: 'delivery_date', dataType: 'timestamp', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'N', generated: 0},
  })
  delivery_date: string;

  @hasMany(() => Meals, {through: {model: () => OrderAttributes, keyFrom: 'orderId', keyTo: 'mealId'}})
  meals: Meals[];

  @hasMany(() => OrderAttributes, {keyTo: 'orderId'})
  orderAttributes: OrderAttributes[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {
  //userId?: OrdersWithRelations;
}

export type OrdersWithRelations = Orders & OrdersRelations;

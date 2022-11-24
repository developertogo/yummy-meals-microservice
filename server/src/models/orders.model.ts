import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Users } from './users.model';

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
  //@belongsTo(() => Users)
  userId: number;

  @property({
    type: 'date',
    required: true,
    generated: 0,
    mysql: {columnName: 'delivery_date', dataType: 'timestamp', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'N', generated: 0},
  })
  deliveryDate: string;

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

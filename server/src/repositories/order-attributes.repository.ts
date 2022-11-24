import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {OrderAttributes, OrderAttributesRelations} from '../models';

export class OrderAttributesRepository extends DefaultCrudRepository<
  OrderAttributes,
  typeof OrderAttributes.prototype.id,
  OrderAttributesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(OrderAttributes, dataSource);
  }
}

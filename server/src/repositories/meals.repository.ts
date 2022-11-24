import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Meals, MealsRelations} from '../models';

export class MealsRepository extends DefaultCrudRepository<
  Meals,
  typeof Meals.prototype.id,
  MealsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Meals, dataSource);
  }
}

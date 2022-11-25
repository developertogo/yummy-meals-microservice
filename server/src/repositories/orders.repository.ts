import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Orders, OrdersRelations, Meals, OrderAttributes} from '../models';
import {OrderAttributesRepository} from './order-attributes.repository';
import {MealsRepository} from './meals.repository';

export class OrdersRepository extends DefaultCrudRepository<
  Orders,
  typeof Orders.prototype.id,
  OrdersRelations
> {

  public readonly meals: HasManyThroughRepositoryFactory<Meals, typeof Meals.prototype.id,
          OrderAttributes,
          typeof Orders.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('OrderAttributesRepository') protected orderAttributesRepositoryGetter: Getter<OrderAttributesRepository>, @repository.getter('MealsRepository') protected mealsRepositoryGetter: Getter<MealsRepository>,
  ) {
    super(Orders, dataSource);
    this.meals = this.createHasManyThroughRepositoryFactoryFor('meals', mealsRepositoryGetter, orderAttributesRepositoryGetter,);
    this.registerInclusionResolver('meals', this.meals.inclusionResolver);
  }
}

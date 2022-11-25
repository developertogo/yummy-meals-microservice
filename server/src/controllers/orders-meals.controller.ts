import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Orders,
OrderAttributes,
Meals,
} from '../models';
import {OrdersRepository} from '../repositories';

export class OrdersMealsController {
  constructor(
    @repository(OrdersRepository) protected ordersRepository: OrdersRepository,
  ) { }

  @get('/orders/{id}/meals', {
    responses: {
      '200': {
        description: 'Array of Orders has many Meals through OrderAttributes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Meals)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Meals>,
  ): Promise<Meals[]> {
    return this.ordersRepository.meals(id).find(filter);
  }

  @post('/orders/{id}/meals', {
    responses: {
      '200': {
        description: 'create a Meals model instance',
        content: {'application/json': {schema: getModelSchemaRef(Meals)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Orders.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meals, {
            title: 'NewMealsInOrders',
            exclude: ['id'],
          }),
        },
      },
    }) meals: Omit<Meals, 'id'>,
  ): Promise<Meals> {
    return this.ordersRepository.meals(id).create(meals);
  }

  @patch('/orders/{id}/meals', {
    responses: {
      '200': {
        description: 'Orders.Meals PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meals, {partial: true}),
        },
      },
    })
    meals: Partial<Meals>,
    @param.query.object('where', getWhereSchemaFor(Meals)) where?: Where<Meals>,
  ): Promise<Count> {
    return this.ordersRepository.meals(id).patch(meals, where);
  }

  @del('/orders/{id}/meals', {
    responses: {
      '200': {
        description: 'Orders.Meals DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Meals)) where?: Where<Meals>,
  ): Promise<Count> {
    return this.ordersRepository.meals(id).delete(where);
  }
}

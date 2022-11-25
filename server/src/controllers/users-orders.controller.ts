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
  Users,
  Orders,
} from '../models';
import {UsersRepository} from '../repositories';

export class UsersOrdersController {
  constructor(
    @repository(UsersRepository) protected usersRepository: UsersRepository,
  ) { }

  @get('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of Users has many Orders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Orders)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Orders>,
  ): Promise<Orders[]> {
    return this.usersRepository.orders(id).find(filter);
  }

  @post('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {'application/json': {schema: getModelSchemaRef(Orders)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Users.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orders, {
            title: 'NewOrdersInUsers',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) orders: Omit<Orders, 'id'>,
  ): Promise<Orders> {
    return this.usersRepository.orders(id).create(orders);
  }

  @patch('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'Users.Orders PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orders, {partial: true}),
        },
      },
    })
    orders: Partial<Orders>,
    @param.query.object('where', getWhereSchemaFor(Orders)) where?: Where<Orders>,
  ): Promise<Count> {
    return this.usersRepository.orders(id).patch(orders, where);
  }

  @del('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'Users.Orders DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Orders)) where?: Where<Orders>,
  ): Promise<Count> {
    return this.usersRepository.orders(id).delete(where);
  }
}

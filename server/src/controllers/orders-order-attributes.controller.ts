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
} from '../models';
import {OrdersRepository} from '../repositories';

export class OrdersOrderAttributesController {
  constructor(
    @repository(OrdersRepository) protected ordersRepository: OrdersRepository,
  ) { }

  @get('/orders/{id}/order-attributes', {
    responses: {
      '200': {
        description: 'Array of Orders has many OrderAttributes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderAttributes)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OrderAttributes>,
  ): Promise<OrderAttributes[]> {
    return this.ordersRepository.orderAttributes(id).find(filter);
  }

  @post('/orders/{id}/order-attributes', {
    responses: {
      '200': {
        description: 'Orders model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrderAttributes)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Orders.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderAttributes, {
            title: 'NewOrderAttributesInOrders',
            exclude: ['id'],
            optional: ['orderId']
          }),
        },
      },
    }) orderAttributes: Omit<OrderAttributes, 'id'>,
  ): Promise<OrderAttributes> {
    return this.ordersRepository.orderAttributes(id).create(orderAttributes);
  }

  @patch('/orders/{id}/order-attributes', {
    responses: {
      '200': {
        description: 'Orders.OrderAttributes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderAttributes, {partial: true}),
        },
      },
    })
    orderAttributes: Partial<OrderAttributes>,
    @param.query.object('where', getWhereSchemaFor(OrderAttributes)) where?: Where<OrderAttributes>,
  ): Promise<Count> {
    return this.ordersRepository.orderAttributes(id).patch(orderAttributes, where);
  }

  @del('/orders/{id}/order-attributes', {
    responses: {
      '200': {
        description: 'Orders.OrderAttributes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(OrderAttributes)) where?: Where<OrderAttributes>,
  ): Promise<Count> {
    return this.ordersRepository.orderAttributes(id).delete(where);
  }
}

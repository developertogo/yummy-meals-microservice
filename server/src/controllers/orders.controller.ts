import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Orders} from '../models';
import {OrdersRepository} from '../repositories';
import _ from 'lodash';

export class OrdersController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository : OrdersRepository,
  ) {}

  @post('/api/v1/orders')
  @response(200, {
    description: 'Orders model instance',
    content: {'application/json': {schema: getModelSchemaRef(Orders)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orders, {
            title: 'NewOrders',
            exclude: ['id'],
          }),
        },
      },
    })
    orders: Omit<Orders, 'id'>,
  ): Promise<Orders> {
    return this.ordersRepository.create(orders);
  }

  @get('/api/v1/orders/count')
  @response(200, {
    description: 'Orders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Orders) where?: Where<Orders>,
  ): Promise<Count> {
    return this.ordersRepository.count(where);
  }

//"delivery_date": "2018-06-15T07:00:00.000Z",

  private constructFilter(user_id: number, delivery_date: string, sort: string, direction: string, page: number, per: number) : any {
    if (page > 0) {
      page -= 1;
    }

    let filter = {
      "offset": page * per,
      "limit": per,
      "order": `${sort} ${direction}`,
      "where": {
        "user_id": user_id,
      },
      "fields": {
        "id": true,
        "user_id": true,
        "delivery_date": true,
      },
      "include": [
        "meals",
        "orderAttributes"
      ]
    }

    let tmp = filter as unknown;

    if (delivery_date != '') {
       tmp = { ...filter, where: { user_id: user_id, delivery_date: delivery_date }}
       return tmp;
    }

    return filter;
  }

  @get('/api/v1/orders')
  @response(200, {
    description: 'Array of Orders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Orders, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.number('user_id') user_id = 0,
    @param.query.string('delivery_date') delivery_date = '',
    @param.query.string('sort') sort = 'id',
    @param.query.string('direction') direction = 'asc',
    @param.query.number('page') page = 0,
    @param.query.number('per') per = 4,
    // TODO: For future use
    //@param.filter(Orders) filter?: Filter<Orders>,
  ): Promise<Orders[]> {
    // throw an error when the user_id param is not a natural number
    if (!Number.isInteger(user_id) || user_id < 1) {
      throw new HttpErrors.UnprocessableEntity('User Id is Required');
    }
    let filter = this.constructFilter(user_id, delivery_date, sort, direction, page, per);
    return this.formatResponse(await this.ordersRepository.find(filter))
    // TODO: For future use
    //return this.ordersRepository.find(filter);
  }

  formatResponse(orders : Orders[]) : any {
    let res : any = {}
    let orders_with_quantity : any = []

    _.each(orders, (order, i) => {
      orders_with_quantity[i] = _.pick(order, ['id', 'delivery_date'])
      let delivery_date = new Date(orders_with_quantity[i]['delivery_date'])
      orders_with_quantity[i]['delivery_date'] = delivery_date.toISOString().split('T')[0];
      orders_with_quantity[i]['meal_count'] = order.meals.length
      let details = _.map(order.orderAttributes, obj => _.pick(obj, ['mealId', 'quantity']))
      let meal = _.merge(_.keyBy(order.meals, 'id'), _.keyBy(details, 'mealId'));
      orders_with_quantity[i]['meals'] = _.map(meal, obj => _.pick(obj, ['id', 'quantity', 'name', 'description', 'image_url']))
    })

    res["orders"] = orders_with_quantity;
    return res;
  }

  @patch('/api/v1/orders')
  @response(200, {
    description: 'Orders PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orders, {partial: true}),
        },
      },
    })
    orders: Orders,
    @param.where(Orders) where?: Where<Orders>,
  ): Promise<Count> {
    return this.ordersRepository.updateAll(orders, where);
  }

  @get('/api/v1/orders/{id}')
  @response(200, {
    description: 'Orders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Orders, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Orders, {exclude: 'where'}) filter?: FilterExcludingWhere<Orders>
  ): Promise<Orders> {
    return this.ordersRepository.findById(id, filter);
  }

  @patch('/api/v1/orders/{id}')
  @response(204, {
    description: 'Orders PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orders, {partial: true}),
        },
      },
    })
    orders: Orders,
  ): Promise<void> {
    await this.ordersRepository.updateById(id, orders);
  }

  @put('/api/v1/orders/{id}')
  @response(204, {
    description: 'Orders PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orders: Orders,
  ): Promise<void> {
    await this.ordersRepository.replaceById(id, orders);
  }

  @del('/api/v1/orders/{id}')
  @response(204, {
    description: 'Orders DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ordersRepository.deleteById(id);
  }
}

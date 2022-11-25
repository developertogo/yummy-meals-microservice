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
  JsonBodyParser,
} from '@loopback/rest';
import {Orders} from '../models';
import {OrdersRepository} from '../repositories';

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

  constructFilter() : any {
    let filter = {
      "offset": 0,
      "limit": 100,
      "skip": 0,
      "order": "id",
      "where": {
        "userId": 1
      },
      "fields": {
        "id": true,
        "userId": false,
        "delivery_date": true
      },
      "include": [
        {
          "relation": "meals",
          "scope": {
            "offset": 0,
            "limit": 100,
            "skip": 0,
            "order": "id",
            "where": {
            },
            "fields": {},
            "include": [
            ]
          }
        },
        "orderAttributes"
      ]
    };

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
    f = this.constructFilter()
    //@param.filter(Orders) filter?: Filter<Orders>,
  ): Promise<Orders[]> {
    /*
    let data = this.ordersRepository.find(filter);
    let orders = {};
    return data;
    */
    return this.formatResponse(await this.ordersRepository.find(f))
  }

  formatResponse(orders : Orders[]) : any {
    let data1 : any = {}
    let data2 = <JSON>data1
    let data = orders;

    data1["orders"] = data;

    return data1;
  }

/*
  @get('/api/v1/oa-orders')
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
    @param.filter(Orders) filter?: Filter<Orders>,
  ): Promise<Orders[]> {
    return this.ordersRepository.find(filter);
  }
*/

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

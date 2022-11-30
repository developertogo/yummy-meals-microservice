import {ExpressRequestHandler} from '@loopback/rest';
import {Orders} from './models';
import {OrdersRepository} from './repositories';
import {Getter, inject} from '@loopback/core';

let ordersRepositoryGetter : Getter<OrdersRepository>;

export const requestHandler: ExpressRequestHandler = async (req, res, next) => {
  res.send(req.path);
  return;
  //let getter = @repository.getter(OrdersRepository);

  let f = constructFilter();
  let data = ordersService(f);

  res.send(data);
  //res.send(req.path);
};

async function ordersService(f : any): Promise<void> {
//  @inject(OrdersRepository) ordersRepository: OrdersRepository;
  let ordersRepository = await ordersRepositoryGetter();

  return formatResponse(await ordersRepository.find(f));
};

function constructFilter() : any {
  let filter_bak = {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "id",
    "where": {
    },
    "fields": {
      "id": true,
      "user_id": false,
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

  let filter = {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "id",
    "where": {
    },
    "fields": {
      "id": true,
      "user_id": false,
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
    ]
  }

  return filter;
}

function formatResponse(orders : Orders[]) : any {
  let data1 : any = {}
  let data2 = <JSON>data1
  let data = orders;

  data1["orders"] = data;

  // TODO: stuff data in "orders" property
  return data1;
  //return data;
}
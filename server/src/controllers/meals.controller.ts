import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  oas,
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Meals} from '../models';
import {MealsRepository} from '../repositories';

export class MealsController {
  constructor(
    @repository(MealsRepository)
    public mealsRepository : MealsRepository,
  ) {}

  // TODO:
  //@oas.visibility(OperationVisibility.UNDOCUMENTED)
  @post('/api/v1/meals')
  @response(200, {
    description: 'Meals model instance',
    content: {'application/json': {schema: getModelSchemaRef(Meals)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meals, {
            title: 'NewMeals',
            exclude: ['id'],
          }),
        },
      },
    })
    meals: Omit<Meals, 'id'>,
  ): Promise<Meals> {
    return this.mealsRepository.create(meals);
  }

  @get('/api/v1/meals/count')
  @response(200, {
    description: 'Meals model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Meals) where?: Where<Meals>,
  ): Promise<Count> {
    return this.mealsRepository.count(where);
  }

  @get('/api/v1/meals')
  @response(200, {
    description: 'Array of Meals model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Meals, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Meals) filter?: Filter<Meals>,
  ): Promise<Meals[]> {
    return this.mealsRepository.find(filter);
  }

  @patch('/api/v1/meals')
  @response(200, {
    description: 'Meals PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meals, {partial: true}),
        },
      },
    })
    meals: Meals,
    @param.where(Meals) where?: Where<Meals>,
  ): Promise<Count> {
    return this.mealsRepository.updateAll(meals, where);
  }

  @get('/api/v1/meals/{id}')
  @response(200, {
    description: 'Meals model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Meals, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Meals, {exclude: 'where'}) filter?: FilterExcludingWhere<Meals>
  ): Promise<Meals> {
    return this.mealsRepository.findById(id, filter);
  }

  @patch('/api/v1/meals/{id}')
  @response(204, {
    description: 'Meals PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meals, {partial: true}),
        },
      },
    })
    meals: Meals,
  ): Promise<void> {
    await this.mealsRepository.updateById(id, meals);
  }

  @put('/api/v1/meals/{id}')
  @response(204, {
    description: 'Meals PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() meals: Meals,
  ): Promise<void> {
    await this.mealsRepository.replaceById(id, meals);
  }

  @del('/api/v1/meals/{id}')
  @response(204, {
    description: 'Meals DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mealsRepository.deleteById(id);
  }
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository, ModelDelegate } from './base.repository';

type IdType = string | number | any;

@Injectable()
export abstract class BaseService<
  TModel,
  TRepository extends BaseRepository<TModel, ModelDelegate>,
  TCreateDto,
  TUpdateDto
> {
  /**
   * Base Service Constructor
   * @param repository The repository instance for data access.
   * @param idKey The name of the primary key field (default: 'id').
   */
  protected constructor(
    protected readonly repository: TRepository,
    protected readonly idKey: string = 'id',
  ) { }

  async create(
    createDto: TCreateDto,
    repoParams?: { include?: object; select?: object },
  ): Promise<TModel> {
    try {
      const data = createDto as object;
      return await this.repository.create({ data, ...repoParams });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error(`[${this.constructor.name}] Error during create:`, error);
      // Generic error message
      throw new InternalServerErrorException('Could not create the record.');
    }
  }

  async findMany(repoParams?: {
    skip?: number;
    take?: number;
    cursor?: object;
    where?: object;
    orderBy?: object | object[];
    select?: object;
    include?: object;
  }): Promise<TModel[]> {
    try {
      return await this.repository.findMany(repoParams);
    } catch (error) {
      console.error(`[${this.constructor.name}] Error during findMany:`, error);
      // Generic error message
      throw new InternalServerErrorException('Could not retrieve records.');
    }
  }

  async findOneById(
    id: IdType,
    repoParams?: { include?: object; select?: object },
  ): Promise<TModel> {
    const where = { [this.idKey]: id };
    let entity: TModel | null = null;

    try {
      entity = await this.repository.findUnique({ where, ...repoParams });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error during findOneById lookup for ID ${id}:`, error);
      // Generic error message
      throw new InternalServerErrorException(`An error occurred while retrieving record with ID ${id}.`);
    }

    if (!entity) {
      // Generic error message
      throw new NotFoundException(`Record with ID ${id} not found.`);
    }
    return entity;
  }

  async findUnique(params: {
    where: object;
    include?: object;
    select?: object;
  }): Promise<TModel | null> {
    try {
      return await this.repository.findUnique(params);
    } catch (error) {
      console.error(`[${this.constructor.name}] Error during findUnique:`, error);
      // Generic error message
      throw new InternalServerErrorException('Could not retrieve the record by unique criteria.');
    }
  }

  async update(
    id: IdType,
    updateDto: TUpdateDto,
    repoParams?: { include?: object; select?: object },
  ): Promise<TModel> {
    const where = { [this.idKey]: id };
    const data = updateDto as object;

    try {
      return await this.repository.update({ where, data, ...repoParams });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error(`[${this.constructor.name}] Error during update for ID ${id}:`, error);
      // Generic error message
      throw new InternalServerErrorException(`Could not update record with ID ${id}.`);
    }
  }

  async delete(id: IdType): Promise<TModel> {
    const where = { [this.idKey]: id };
    try {
      return await this.repository.delete({ where });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`[${this.constructor.name}] Error during delete for ID ${id}:`, error);
      // Generic error message
      throw new InternalServerErrorException(`Could not delete record with ID ${id}.`);
    }
  }

}
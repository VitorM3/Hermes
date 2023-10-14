import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import BaseEntity from '../entity/base';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EConnection } from 'src/modules/databases/domain/enum/connection.enum';

export default class ImportDatabaseProvider<T extends BaseEntity, V> {
  public constructor(
    private entity: T & EntityClassOrSchema,
    private view: V & EntityClassOrSchema,
  ) {}

  public getProviders() {
    return [
      TypeOrmModule.forFeature([this.entity], EConnection.POSTGRESQL),
      TypeOrmModule.forFeature([this.view], EConnection.SQLSERVER),
    ];
  }
}

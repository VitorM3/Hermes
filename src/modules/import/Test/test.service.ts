import ImportService from 'src/modules/config/services/import.service';
import TestEntity from './entity/test.postgres.entity';
import TestViewEntity from './entity/test.view.entity';
import TestPayload from './types/test.payload';
import TestImport from './test.import';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EConnection } from 'src/modules/databases/domain/enum/connection.enum';

@Injectable()
export default class TestService extends ImportService<
  TestEntity,
  TestViewEntity,
  TestPayload
> {
  public constructor(
    @InjectRepository(TestEntity, EConnection.POSTGRESQL)
    testEntityRepository: Repository<TestEntity>,
    @InjectRepository(TestViewEntity, EConnection.SQLSERVER)
    testViewEntityRepository: Repository<TestViewEntity>,
  ) {
    super(new TestImport(testEntityRepository, testViewEntityRepository));
  }
}

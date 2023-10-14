import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EConnection } from '../databases/domain/enum/connection.enum';
import TestEntity from './Test/entity/test.postgres.entity';
import TestViewEntity from './Test/entity/test.view.entity';
import TestService from './Test/test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestEntity], EConnection.POSTGRESQL),
    TypeOrmModule.forFeature([TestViewEntity], EConnection.SQLSERVER),
  ],
  providers: [TestService],
  exports: [TestService],
})
export default class ImportModule {}

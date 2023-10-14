import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostgreSqlConnection from './domain/connection/postgresql.connection';
import { EConnection } from './domain/enum/connection.enum';
import SqlserverConnection from './domain/connection/sqlserver.connection';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: EConnection.POSTGRESQL,
      useFactory: async (config: ConfigService) => {
        const connection = new PostgreSqlConnection(config);
        return connection.getConnection();
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: EConnection.SQLSERVER,
      useFactory: async (config: ConfigService) => {
        const connection = new SqlserverConnection(config);
        return connection.getConnection();
      },
    }),
  ],
})
export default class DatabaseModule {}

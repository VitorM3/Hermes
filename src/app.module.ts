import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from './modules/databases/database.module';
import ImportModule from './modules/import/import.module';
import ConfigImportModule from './modules/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ImportModule,
    ConfigImportModule,
  ],
})
export class AppModule {}

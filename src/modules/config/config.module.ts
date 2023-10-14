import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ImportController from './controllers/importer.controller';
import ImportModule from '../import/import.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IMPORTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'importer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'importer-group',
          },
        },
      },
    ]),
    ImportModule,
  ],
  controllers: [ImportController],
  providers: [],
})
export default class ConfigImportModule {}

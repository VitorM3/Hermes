import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';
import TablesImporterService from '../domain/definition/tables-importer.service';
import { EImport } from '../domain/enum/table.enum';
import TestService from 'src/modules/import/Test/test.service';

@Controller()
export default class ImportController implements OnModuleInit {
  private tablesImporter: TablesImporterService;
  public constructor(
    @Inject('IMPORTER')
    private readonly client: ClientKafka,

    private readonly testImport: TestService,
  ) {
    this.tablesImporter = new TablesImporterService(this.client);
  }
  onModuleInit() {
    this.tablesImporter.registerTables();
    this.testImport.general();
  }

  @TablesImporterService.event([EImport.t1])
  public async test2(@Payload() test: any) {
    if (test && test.payload) {
      return await this.testImport.sync(test.payload);
    }
  }
}

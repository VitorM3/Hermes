import { ConfigService } from "@nestjs/config";
import { ClientKafka, EventPattern } from "@nestjs/microservices";
import { EImport } from "../enum/table.enum";
import { applyDecorators } from "@nestjs/common";
import * as dotenv from "dotenv"
dotenv.config()

const connection = process.env.CONNECTION;
const database = process.env.DATABASE;
const schema = process.env.SCHEMA;

export default class TablesImporterService {
    private tables: string[];
    private client: ClientKafka;
    private static connectionName: string = connection;
    private static databaseName: string = database;
    private static schemaName: string = schema;
    public constructor(client: ClientKafka){
        this.tables = Object.keys(EImport);
        this.client = client;
    }

    private static nameEvent(table: string){
        return `${this.connectionName}.${this.databaseName}.${this.schemaName}.${table}`
    }

    public registerTables(){
        this.tables.map((table)=>{
            console.log(TablesImporterService.nameEvent(table));
            this.client.subscribeToResponseOf(TablesImporterService.nameEvent(table));
        })
    }

    public static event(tablesToEvent: EImport[]){
        const decorators = tablesToEvent.map((tableToEvent)=>{
            const table = Object.keys(EImport)[Object.values(EImport).indexOf(tableToEvent)]
            return EventPattern(this.nameEvent(table))
        })
        return applyDecorators(...decorators)
    }
}
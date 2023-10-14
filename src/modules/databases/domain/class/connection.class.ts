import { ConfigService } from '@nestjs/config';
import { EConnection } from '../enum/connection.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default abstract class Connection {
  private host: string;
  private port: number;
  private database: string;
  private userName: string;
  private password: string;
  private type: 'postgres' | 'mssql';
  private migration: string;
  public constructor(
    private readonly configService: ConfigService,
    connection: EConnection,
  ) {
    this.host = this.configService.get(Connection.getEnv(connection, 'host'));
    this.port = parseInt(
      this.configService.get(Connection.getEnv(connection, 'port')),
    );
    this.database = this.configService.get(
      Connection.getEnv(connection, 'database'),
    );
    this.userName = this.configService.get(
      Connection.getEnv(connection, 'user'),
    );
    this.password = this.configService.get(
      Connection.getEnv(connection, 'pass'),
    );
    this.migration = `../../migration/${connection}/*.ts`;
    this.type = connection;
  }

  public getConnection(): TypeOrmModuleOptions {
    const connection = {
      type: this.type,
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.userName,
      password: this.password,
      autoLoadEntities: true,
      entities: [join(__dirname, 'dist/**/*.entity.js')],
      sicronize: false,
    };

    if (this.type == 'mssql') {
      connection['extra'] = {
        trustServerCertificate: true,
      };
    }

    return connection;
  }

  private static getEnv(connection: EConnection, variable: string) {
    return `${variable.toUpperCase()}_${connection.toUpperCase()}`;
  }
}

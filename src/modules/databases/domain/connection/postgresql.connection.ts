import { ConfigService } from '@nestjs/config';
import Connection from '../class/connection.class';
import { EConnection } from '../enum/connection.enum';

export default class PostgreSqlConnection extends Connection {
  public constructor(config: ConfigService) {
    super(config, EConnection.POSTGRESQL);
  }
}

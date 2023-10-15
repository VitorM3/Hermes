import ImportClass from '../domain/class/import.class';
import { TPayload } from '../domain/types/payload.type';
import BaseEntity from '../domain/entity/base';

export default abstract class ImportService<T extends BaseEntity, V, P> {
  public constructor(private readonly importClass: ImportClass<T, V, P>) {}
  /**
   * Realizar a importação de apenas 1 dado
   * @param payload Payload vindo do Kafka
   */
  public async import(payload: TPayload<P>) {
    return await this.importClass.import(payload);
  }

  /**
   * Realizar a sincronização dos dados da tabela
   */
  public async sync() {
    return await this.importClass.sync();
  }
}

import { FindOptionsWhere, Repository } from 'typeorm';
import Transformer from './transformer.class';
import WhereCondition from './whereCondition.class';
import ImportAbstractService from 'src/modules/config/services/import-abstract.service';
import { TPayload } from '../types/payload.type';
import BaseEntity from 'src/modules/config/domain/entity/base';
import AlternativeGetClass from './alternative-get.class';

export default abstract class ImportClass<T extends BaseEntity, V, P> {
  /**
   * Operações realizadas antes da importação
   */
  public abstract before?: Transformer<T, P>;
  /**
   * Operações realizadas depois da importação
   */
  public abstract after?: Transformer<T, P>;
  /**
   * Condição para busca do dado dentro da view
   */
  public abstract whereConditionView: WhereCondition[];
  /**
   * Condição para busca do dado dentro da tabela
   */
  public abstract whereConditionTable: WhereCondition[];
  /**
   * Forma alternativa de busca dos dados da tabela
   */
  public abstract alternativeGetTable?: AlternativeGetClass<T, P>;
  /**
   * Forma alternativa de busca dos dados da view
   */
  public abstract alternativeGetView?: AlternativeGetClass<V, P>;
  /**
   * Realizar a transformação do dado vindo da view
   * @param viewData Dado vindo da view
   */
  public abstract serialize(viewData: V): Promise<T>;

  private import: ImportAbstractService<T, V, P>;

  public constructor(
    public repositoryTable: Repository<T>,
    public repositoryView: Repository<V>,
  ) {
    this.import = new ImportAbstractService<T, V, P>(this);
  }

  /**
   * Sincronizar o objeto para realizar uma verificação precisa
   * @param table Objeto que será sincronizado
   * @param object Objeto que será usado como base para a sincronização
   * @returns Objeto sincronizado
   */
  public async syncObject(table: T, object: T) {
    const keys = Object.keys(object);
    const value = {};
    await Promise.all(
      keys.map((key) => {
        value[key] = table[key];
        return value;
      }),
    );
    return value as T;
  }
  /**
   * Realizar a importação de um dado
   * @param payload Payload vindo do Kafka
   */
  public async importData(payload: TPayload<P>) {
    return await this.import.sync(payload);
  }
  /**
   * Sincronizar dados da view
   */
  public async sync() {
    return await this.import.general();
  }
  /**
   * Buscar um dado da view utilizando as condições de buscas definidas
   * @param payload Payload vindo do Kafka
   * @returns Dado da view
   */
  public async getOneDataByView(payload: P): Promise<V> {
    await this.before?.formatPayloadInView(payload);
    const where = this.getWhereView(payload);
    await this.after?.formatPayloadInView(payload);
    if (this.alternativeGetView) {
      return await this.alternativeGetView.one(payload);
    }
    return await this.getOneByDatabase<V>(where, this.repositoryView);
  }
  /**
   * Buscar um dado da tabela utilizando as condições de buscas definidas
   * @param payload Payload vindo do Kafka
   * @returns Dado da tabela
   */
  public async getOneDataByTable(payload: P): Promise<T> {
    await this.before?.formatPayloadInTable(payload);
    const where = this.getWhereTable(payload);
    await this.after?.formatPayloadInTable(payload);
    if (!where) {
      return;
    }
    if (this.alternativeGetTable) {
      return await this.alternativeGetTable.one(payload);
    }
    return await this.getOneByDatabase<T>(where, this.repositoryTable);
  }
  /**
   * Buscar todos os dados da view
   * @returns Todos os dados da view
   */
  public async getAllDataByView() {
    if (this.alternativeGetView) {
      return await this.alternativeGetView.many();
    }
    return await this.getAllByDatabase<V>(this.repositoryView);
  }
  /**
   * Buscar todos os dados da tabela
   * @returns Todos os dados da tabela
   */
  public async getAllDataByTable() {
    if (this.alternativeGetTable) {
      return await this.alternativeGetTable.many();
    }
    return await this.getAllByDatabase<T>(this.repositoryTable);
  }
  /**
   * Buscar um dado da view ou da tabela
   * @param whereCondition Condição de busca
   * @param repository Repositorio do typeORM
   * @returns Dado vindo da view ou da tabela
   */
  private async getOneByDatabase<F>(
    whereCondition: WhereCondition[],
    repository: Repository<F>,
  ) {
    const where: FindOptionsWhere<F> = {};
    whereCondition.map((value) => {
      where[value.where] = value.payload;
    });
    return await repository.findOne({ where });
  }
  /**
   * Buscar todos os dados da view ou da tabela
   * @param repository Repositório do typeORM
   * @returns Dados da view ou da tabela
   */
  private async getAllByDatabase<F>(repository: Repository<F>) {
    return await repository.find();
  }
  /**
   * Criar condição de busca da view com base no preenchido na importação e no payload
   * @param payload Payload vindo do Kafka
   * @returns Condição de busca
   */
  private getWhereView(payload: P) {
    return this.getWhere(payload, this.whereConditionView);
  }
  /**
   * Criar condição de busca da tabela com base no preenchido na importação e no payload
   * @param payload Payload vindo do Kafka
   * @returns Condição de busca
   */
  private getWhereTable(payload: P) {
    return this.getWhere(payload, this.whereConditionTable);
  }
  /**
   * Criar condição de busca
   * @param payload Payload vindo do Kafka
   * @param whereCondition Condição de busca da importação
   * @returns Condição de busca
   */
  private getWhere(payload: P, whereCondition: WhereCondition[]) {
    if (!payload) {
      return;
    }
    const keys = Object.keys(payload);
    const values = whereCondition.map((where) => {
      const whereFind = Object.assign({}, where);
      const key = keys.find((keyObj) => keyObj == whereFind.payload);
      const value = payload[key];
      whereFind.payload = value;
      return whereFind;
    });
    return values;
  }
}

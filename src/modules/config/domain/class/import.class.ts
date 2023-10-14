import { FindOptionsWhere, Repository } from 'typeorm';
import Transformer from './transformer.class';
import WhereCondition from './whereCondition.class';
import ImportAbstractService from 'src/modules/config/services/import-abstract.service';
import { TPayload } from '../types/payload.type';
import BaseEntity from 'src/modules/config/domain/entity/base';

export default abstract class ImportClass<T extends BaseEntity, V, P> {
  public abstract before?: Transformer<T>;
  public abstract after?: Transformer<T>;
  public abstract whereConditionView: WhereCondition[];
  public abstract whereConditionTable: WhereCondition[];
  public abstract serialize(viewData: V): Promise<T>;
  public abstract syncObject(table: T): Promise<T>;
  public abstract alternativeGetView(): Promise<any>;
  public abstract alternativeGetTable(): Promise<any>;
  private import: ImportAbstractService<T, V, P>;

  public haveAlternativeGetView: boolean = false;
  public haveAlternativeGetTable: boolean = false;
  public constructor(
    public repositoryTable: Repository<T>,
    public repositoryView: Repository<V>,
  ) {
    this.import = new ImportAbstractService<T, V, P>(this);
  }

  public async sync(payload: TPayload<P>) {
    return await this.import.sync(payload);
  }

  public async general() {
    return await this.import.general();
  }

  public async getOneDataByView(payload: P): Promise<V> {
    const where = this.getWhereView(payload);
    if (this.haveAlternativeGetView) {
      return await this.alternativeGetView();
    }
    return await this.getOneByDatabase<V>(where, this.repositoryView);
  }

  public async getOneDataByTable(payload: P): Promise<T> {
    const where = this.getWhereTable(payload);
    if (!where) {
      return;
    }
    if (this.haveAlternativeGetTable) {
      return await this.alternativeGetTable();
    }
    return await this.getOneByDatabase<T>(where, this.repositoryTable);
  }

  public async getAllDataByView() {
    return await this.getAllByDatabase<V>(this.repositoryView);
  }

  public async getAllDataByTable() {
    return await this.getAllByDatabase<T>(this.repositoryTable);
  }

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

  private async getAllByDatabase<F>(repository: Repository<F>) {
    return await repository.find();
  }

  private getWhereView(payload: P) {
    return this.getWhere(payload, this.whereConditionView);
  }

  private getWhereTable(payload: P) {
    return this.getWhere(payload, this.whereConditionTable);
  }

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

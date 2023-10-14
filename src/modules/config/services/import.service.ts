import ImportClass from '../domain/class/import.class';
import { TPayload } from '../domain/types/payload.type';
import BaseEntity from '../domain/entity/base';

export default abstract class ImportService<T extends BaseEntity, V, P> {
  public constructor(private readonly importClass: ImportClass<T, V, P>) {}
  public async sync(payload: TPayload<P>) {
    return await this.importClass.sync(payload);
  }

  public async general() {
    return await this.importClass.general();
  }
}

import ImportClass from '../domain/class/import.class';
import { TPayload } from '../domain/types/payload.type';
import BaseEntity from '../domain/entity/base';

export default class ImportAbstractService<T extends BaseEntity, V, P> {
  public constructor(private readonly importClass: ImportClass<T, V, P>) {}

  public async sync(payload: TPayload<P>) {
    if (payload.before && payload.after) {
      await this.change(payload.after);
      return;
    }
    if (!payload.before && payload.after) {
      await this.add(payload.after);
      return;
    }
    await this.remove(payload.before);
  }

  public async general() {
    const viewDatum = await this.importClass.getAllDataByView();
    const serializeView = await Promise.all(
      viewDatum.map(async (viewData) => {
        return await this.importClass.serialize(viewData);
      }),
    );
    const tableDatum = await this.importClass.getAllDataByTable();
    const serializeTable = await Promise.all(
      tableDatum.map(async (table) => {
        return await this.importClass.syncObject(table, serializeView[0]);
      }),
    );
    const removeData = await Promise.all(
      serializeTable
        .map((valueTable) => {
          if (
            serializeView.find((value) => JSON.stringify(value) == valueTable)
          ) {
            valueTable.deletedAt = new Date();
            return valueTable;
          }
        })
        .filter((v) => v),
    );
    await this.importClass.before?.gerenal(serializeView);
    await this.importClass.repositoryTable.save(serializeView);
    await this.importClass.after?.gerenal(serializeView);
    await this.importClass.repositoryTable.save(removeData);
  }

  private async add(payload: P) {
    const view = await this.importClass.getOneDataByView(payload);
    const serialize = await this.importClass.serialize(view);
    await this.importClass.before?.all(serialize);
    await this.importClass.before?.add(serialize);
    await this.importClass.repositoryTable.save(serialize);
    await this.importClass.after?.all(serialize);
    await this.importClass.after?.add(serialize);
  }

  private async change(payload: P) {
    const view = await this.importClass.getOneDataByView(payload);
    if (!view) {
      await this.remove(payload);
      return;
    }
    const serialize = await this.importClass.serialize(view);
    await this.importClass.before?.all(serialize);
    await this.importClass.before?.change(serialize);
    await this.importClass.repositoryTable.save(serialize);
    await this.importClass.after?.all(serialize);
    await this.importClass.after?.change(serialize);
  }

  private async remove(payload: P) {
    const table = await this.importClass.getOneDataByTable(payload);
    if (!table) {
      return;
    }
    await this.importClass.before?.all(table);
    await this.importClass.before?.remove(table);
    table.deletedAt = new Date();
    await this.importClass.repositoryTable.save(table);
    await this.importClass.after?.all(table);
    await this.importClass.after?.remove(table);
  }
}

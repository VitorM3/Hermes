import ImportClass from 'src/modules/config/domain/class/import.class';
import TestEntity from './entity/test.postgres.entity';
import TestViewEntity from './entity/test.view.entity';
import TestPayload from './types/test.payload';
import WhereCondition from 'src/modules/config/domain/class/whereCondition.class';

export default class TestImport extends ImportClass<
  TestEntity,
  TestViewEntity,
  TestPayload
> {
  public after?: null;
  public before?: null;
  public whereConditionTable: WhereCondition[] = [
    {
      where: 'id',
      payload: 'c1',
    },
  ];
  public whereConditionView: WhereCondition[] = [
    {
      where: 'batatinha1',
      payload: 'c1',
    },
  ];

  public async serialize(viewData: TestViewEntity): Promise<TestEntity> {
    const test = new TestEntity();
    test.id = viewData.batatinha1;
    test.test = viewData.batatinha2;
    test.deletedAt = null;
    return test;
  }

  public async syncObject(table: TestEntity): Promise<TestEntity> {
    const test = new TestEntity();
    test.id = table.id;
    test.test = table.test;
    test.deletedAt = null;
    return test;
  }

  public alternativeGetTable(): Promise<void> {
    return;
  }

  public alternativeGetView(): Promise<void> {
    return;
  }
}

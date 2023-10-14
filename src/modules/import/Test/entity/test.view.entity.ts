import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity('vw_test')
export default class TestViewEntity {
  @ViewColumn()
  public batatinha1: number;

  @ViewColumn()
  public batatinha2: string;
}

import BaseEntity from 'src/modules/config/domain/entity/base';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'test' })
export default class TestEntity extends BaseEntity {
  @PrimaryColumn()
  public id: number;

  @Column()
  public test: string;
}

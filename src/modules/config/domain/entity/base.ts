import { Column } from 'typeorm';

export default class BaseEntity {
  @Column({ name: 'deleted_at' })
  public deletedAt: Date;
}

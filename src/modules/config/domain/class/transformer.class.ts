export default abstract class Transformer<T> {
  public abstract getView(params: any): Promise<any>;
  public abstract all(data: T): Promise<T>;
  public abstract add(data: T): Promise<T>;
  public abstract gerenal(data: T[]): Promise<T[]>;
  public abstract change(data: T): Promise<T>;
  public abstract remove(data: T): Promise<T>;
}

export default abstract class Transformer<T, P> {
  /**
   * Formatar Payload da view
   * @param payload Payload vindo do Kafka
   */
  public abstract formatPayloadInView(payload: P): Promise<P>;
  /**
   * Formatar payload da tabela
   * @param payload Payload vindo do Kafka
   */
  public abstract formatPayloadInTable(payload: P): Promise<P>;
  public abstract all(data: T): Promise<T>;
  public abstract add(data: T): Promise<T>;
  public abstract gerenal(data: T[]): Promise<T[]>;
  public abstract change(data: T): Promise<T>;
  public abstract remove(data: T): Promise<T>;
}

export default abstract class AlternativeGetClass<T, P> {
  /**
   * Forma alternativa de buscar um dado
   * @param payload Payload vindo do Kafka
   */
  public abstract one(payload: P): Promise<T>;
  /**
   * Forma alternativa de buscar todos os dados
   */
  public abstract many(): Promise<T[]>;
}

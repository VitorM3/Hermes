export default abstract class AlternativeGetClass<T, P> {
  public abstract one(payload: P): Promise<T>;
  public abstract many(): Promise<T[]>;
}

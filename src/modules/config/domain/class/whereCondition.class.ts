export default abstract class WhereCondition<T, P> {
  private obj?: T;
  private payloadObj?: P;
  public abstract where: keyof typeof this.obj;
  public abstract payload: keyof typeof this.payloadObj;
}

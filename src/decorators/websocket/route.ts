export function Route(method: string) {
  return function _Route(target: any, propertyKey: string): any {
    // method annotation
    const original = target[propertyKey];
    target[propertyKey] = async function execRoute(data: any): Promise<any> {
      const promise = original();
      let res = null;
      if (this.client) {
        res = await this.client.send(method, data);
      }
      await promise;
      return res;
    };
    return target;
  };
}

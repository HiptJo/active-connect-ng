export function Route(
  method: string,
  loadingKey?: string,
  dontEnsureTransmission?: boolean
) {
  return function _Route(target: any, propertyKey: string): any {
    // method annotation
    if (!target.___loading) target.___loading = {};
    target.___loading[loadingKey] = 0;
    const original = target[propertyKey];
    target[propertyKey] = async function execRoute(...data: any): Promise<any> {
      if (loadingKey) target.___loading[loadingKey]++;
      const promise = original(...data);
      let res = null;
      if (this.client) {
        res = await this.client.send(method, data[0], dontEnsureTransmission);
      }
      await promise;
      if (loadingKey) target.___loading[loadingKey]--;
      return res;
    };
    return target;
  };
}

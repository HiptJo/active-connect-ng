import { WebsocketClient } from "../../client/websocket/client";

export function Handle(method: string) {
  return function _Handle(target: any, propertyKey: string): any {
    // method annotation
    const original = target[propertyKey];
    target[propertyKey] = function handle(...data: any[]) {
      return original.bind(this)(data);
    };
    WebsocketClient.registerHandle(method, target, propertyKey);
    return target;
  };
}

import { WebsocketClient } from "../../client/websocket/client";

export function Handle(method: string) {
  return function _Handle(target: any, propertyKey: string): any {
    // method annotation
    WebsocketClient.registerHandle(method, target, propertyKey);
  };
}

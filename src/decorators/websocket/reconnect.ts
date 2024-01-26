import { WebsocketClient } from "../../client/websocket/client";

export function OnReconnect() {
  return function _OnReconnect(target: any, propertyKey: string): any {
    WebsocketClient.onReconnect(target[propertyKey]);
  };
}

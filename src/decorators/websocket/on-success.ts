import { WebsocketClient } from "../../client/websocket/client";

export function OnSuccess(regexp: RegExp) {
  return function _Route(target: any, propertyKey: string): any {
    WebsocketClient.onSuccess(target[propertyKey], regexp);
  };
}

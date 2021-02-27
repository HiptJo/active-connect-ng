import { WebsocketClient } from "../../client/websocket/client";

export function Outbound(method: string, requestingRequired?: boolean) {
  return function _Outbound(target: any, propertyKey: string): any {
    // property annotation
    WebsocketClient.expectOutbound(method, function setOutbound(data: any) {
      target.___received[propertyKey] = true;
      target[propertyKey] = data;
    });
    return {
      configurable: true,
      writeable: true,
      get() {
        if (!target.___received[propertyKey] && requestingRequired) {
          WebsocketClient.send("request." + method, null).then();
        }
        if (!target.___data[propertyKey]) {
          target.loading[propertyKey] = true;
        } else if (target.loading[propertyKey]) {
          target.loading[propertyKey] = false;
        }
        return target.___data[propertyKey];
      },
      set(val: any) {
        return (target.controls[propertyKey] = val);
      },
    };
  };
}

export class WebsocketClient {
  ws: WebSocket;
  pool: { WssConnected: boolean } | null;

  constructor(private url?: string) {
    WebsocketClient.conn = this;
    if (!url) {
      let protocol;
      let port;
      switch (document.location.protocol) {
        case "https:": {
          protocol = "wss:";
          port = ":443";
          break;
        }
        default: {
          protocol = "ws:";
          port = ":80";
          break;
        }
      }
      this.url = protocol + "//" + document.location.hostname + port + "/wss";
    }
    this.connect(url);
  }

  subject: any;

  private connect(url: string) {
    if (!this.subject) {
      this.create(url);
    }
    return this.subject;
  }

  private requestStack: any[] = [];

  private _token = "";
  public get Token(): string {
    if (!this._token) {
      if (window.localStorage)
        this._token = window.localStorage.getItem("token");
    }
    return this._token;
  }
  public set Token(val: string) {
    this._token = val;
    if (window.localStorage) window.localStorage.setItem("token", val);
  }

  private connected: boolean;
  private set Connected(value: boolean) {
    this.connected = value;
    if (this.pool && this.pool.WssConnected) this.pool.WssConnected = value;
    if (value) {
      this.auth(this.Token);
      this.requestStack.forEach((e) => {
        this.sendToSocket(e.method, e.data);
        this.requestStack = this.requestStack.filter((e1) => e1 != e);
      });
    }
  }

  private create(url: string) {
    console.log("trying to recreate connection");
    try {
      this.ws = new WebSocket(url);
    } catch (e) {
      setTimeout(() => {
        this.connect(url);
      }, 500);
    }

    this.ws.onerror = (err) => {
      console.log(err);
      this.connect(url);
    };
    this.ws.onopen = () => {
      this.Connected = true;
    };
    this.ws.onmessage = (e) => {
      this.messageReceived(JSON.parse(e.data.toString()));
    };
    this.ws.onclose = () => {
      this.Connected = false;
      this.connect(this.url);
    };
  }

  protected sendToSocket(method: string, data: any) {
    if (!this.connected) {
      this.requestStack.push({ method, data });
    } else {
      //console.log(JSON.stringify({ method, data }));
      this.ws.send(JSON.stringify({ method, data }));
    }
  }

  auth(token: string) {
    this.sendToSocket("auth.token", token);
  }

  public send(method: string, data: any): Promise<any> {
    this.sendToSocket(method, data);
    return this.expectMethod(`r.${method}`);
  }
  // remove map to allow duplicate calls
  private expectedMethods: Map<string, Function> = new Map();
  private expectMethod(method: string) {
    return new Promise((resolve) => {
      this.expectedMethods.set(method, resolve);
    });
  }

  private messageReceived({ method, data }: { method: string; data: any }) {
    const callback = this.expectedMethods.get(method);
    if (callback) {
      this.expectedMethods.delete(method);
      callback(data);
    } else {
      const out = this.outbounds.get(method);
      if (out) {
        out(data);
      } else {
        const handle = this.handles.get(method);
        if (handle) {
          handle.target[handle.property](data);
        }
      }
    }
  }

  private outbounds: Map<string, (data: any) => void> = new Map();
  protected expectOutbound(method: string, callback: (data: any) => void) {
    this.outbounds.set(method, callback);
  }

  static conn: WebsocketClient;
  static send(method: string, data: any): Promise<any> {
    return WebsocketClient.conn?.send(method, data);
  }
  static expectOutbound(method: string, callback: (data: any) => void) {
    return WebsocketClient.conn?.expectOutbound(method, callback);
  }
  private handles: Map<string, { target: any; property: string }> = new Map();
  static registerHandle(method: string, target: any, property: string) {
    this.conn.handles.set(method, { target, property });
  }

  public get isConnected(): boolean {
    if (this.ws) return this.ws.readyState == WebSocket.OPEN;
    return true;
  }
}

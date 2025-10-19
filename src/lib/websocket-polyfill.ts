class WebSocketPolyfill implements WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = WebSocketPolyfill.CONNECTING;
  readonly OPEN = WebSocketPolyfill.OPEN;
  readonly CLOSING = WebSocketPolyfill.CLOSING;
  readonly CLOSED = WebSocketPolyfill.CLOSED;

  readonly url: string;
  readonly protocol: string = '';
  readonly extensions: string = '';
  readonly bufferedAmount: number = 0;
  binaryType: BinaryType = 'blob';

  private _readyState: number = WebSocketPolyfill.CONNECTING;
  private _ws: WebSocket | null = null;

  onopen: ((ev: Event) => void) | null = null;
  onclose: ((ev: CloseEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;

  constructor(url: string | URL, protocols?: string | string[]) {
    this.url = url.toString();
    
    // If we're in an environment with WebSocket available, use it
    if (typeof WebSocket !== 'undefined') {
      try {
        this._ws = new WebSocket(url, protocols);
        this._setupNativeWebSocket();
      } catch (error) {
        console.warn('Failed to create WebSocket:', error);
        this._readyState = WebSocketPolyfill.CLOSED;
        if (this.onerror) {
          this.onerror(new Event('error'));
        }
      }
    } else {
      // In Edge runtime or environments without WebSocket
      this._readyState = WebSocketPolyfill.CONNECTING;
      // Simulate connection attempt
      setTimeout(() => {
        this._readyState = WebSocketPolyfill.CLOSED;
        if (this.onerror) {
          this.onerror(new Event('error'));
        }
        if (this.onclose) {
          this.onclose(new CloseEvent('close', { wasClean: false, code: 1006, reason: 'WebSocket not supported' }));
        }
      }, 0);
    }
  }

  private _setupNativeWebSocket() {
    if (!this._ws) return;

    this._ws.onopen = (ev) => {
      this._readyState = WebSocketPolyfill.OPEN;
      if (this.onopen) this.onopen(ev);
    };

    this._ws.onclose = (ev) => {
      this._readyState = WebSocketPolyfill.CLOSED;
      if (this.onclose) this.onclose(ev);
    };

    this._ws.onerror = (ev) => {
      if (this.onerror) this.onerror(ev);
    };

    this._ws.onmessage = (ev) => {
      if (this.onmessage) this.onmessage(ev);
    };
  }

  get readyState(): number {
    return this._readyState;
  }

  close(code?: number, reason?: string): void {
    if (this._ws) {
      this._ws.close(code, reason);
    } else {
      this._readyState = WebSocketPolyfill.CLOSED;
      if (this.onclose) {
        this.onclose(new CloseEvent('close', { wasClean: true, code: code || 1000, reason }));
      }
    }
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this._ws) {
      this._ws.send(data);
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (this._ws) {
      this._ws.addEventListener(type, listener, options);
    } else {
      // Store listeners in case we get a WebSocket later
      switch (type) {
        case 'open':
          this.onopen = listener as (ev: Event) => void;
          break;
        case 'close':
          this.onclose = listener as (ev: CloseEvent) => void;
          break;
        case 'error':
          this.onerror = listener as (ev: Event) => void;
          break;
        case 'message':
          this.onmessage = listener as (ev: MessageEvent) => void;
          break;
      }
    }
  }

  removeEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void {
    if (this._ws) {
      this._ws.removeEventListener(type, listener, options);
    } else {
      switch (type) {
        case 'open':
          this.onopen = null;
          break;
        case 'close':
          this.onclose = null;
          break;
        case 'error':
          this.onerror = null;
          break;
        case 'message':
          this.onmessage = null;
          break;
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    if (this._ws) {
      return this._ws.dispatchEvent(event);
    }
    return false;
  }
}

export function getWebSocket(): typeof WebSocket {
  if (typeof WebSocket !== 'undefined') {
    return WebSocket;
  }
  
  return WebSocketPolyfill as unknown as typeof WebSocket;
}
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';

const WEB_SOCKET_STATE = {
  CONNECTING: 0,
  OPEN: 1
};

/**
 * Service for web socket connection
 */
export class WebSocketService {
  #webSocket = null;
  #proxydi = proxydi;
  #accessService = AccessService.getInstance();

  /**
   * Check if connection open
   * @returns {boolean}
   */
  isOpen() {
    return !!this.#webSocket && this.#webSocket.readyState === WEB_SOCKET_STATE.OPEN;
  }

  /**
   * Connect to WebSocket
   */
  connect() {
    const env = this.#proxydi.get('env');

    const { DEIP_WEB_SOCKET_URL } = env;

    const connectInterval = setInterval(() => {
      if (!DEIP_WEB_SOCKET_URL || this.isOpen()) {
        clearInterval(connectInterval);
        return;
      }

      const token = this.#accessService.getAccessToken();
      const url = `${DEIP_WEB_SOCKET_URL}?access_token=${token}`;

      this.#webSocket = new WebSocket(url);

      this.#webSocket.addEventListener('open', () => {
        console.info('Successfully connected to the websocket server...');
        clearInterval(connectInterval);
      });

      this.#webSocket.addEventListener('error', (error) => {
        console.error(error);
      });
    }, 5000);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.#webSocket) {
      this.#webSocket.close();
    }
  }

  /**
   * Add message listener
   * @param {Function} predicate Function to detect message
   * @param {number} timeout
   * @returns {Promise}
   */
  async waitForMessage(predicate, timeout = 10000) {
    if (!this.isOpen()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Failed to receive response in ${timeout}ms`));
        // eslint-disable-next-line no-use-before-define
        cleanup();
      }, timeout);

      const cleanup = () => {
        // eslint-disable-next-line no-use-before-define
        this.#webSocket.removeEventListener('message', handleMessage);
        clearTimeout(timeoutId);
      };

      const handleMessage = (message) => {
        const parsedMessage = JSON.parse(message.data);

        if (predicate(parsedMessage)) {
          const [eventStatus, eventBody] = parsedMessage;

          if (eventStatus === 'EventError') {
            reject(new Error('Error occurred', eventBody.errors));
          }
          resolve(parsedMessage);
          cleanup();
        }
      };

      this.#webSocket.addEventListener('message', handleMessage);
    });
  }

  /** @type {() => WebSocketService} */
  static getInstance = createInstanceGetter(WebSocketService);
}

import { AccessService } from '@deip/access-service';
import axios from 'axios';
import { proxydi } from '@deip/proxydi';

import { Singleton, isFunction } from '@deip/toolbox';

class HttpService extends Singleton {
  accessService = AccessService.getInstance();

  proxydi = proxydi;

  _axiosInstance;

  get axios() {
    // eslint-disable-next-line no-return-assign
    return this._axiosInstance
      ? this._axiosInstance
      : this._axiosInstance = axios.create({
        baseURL: this.proxydi.get('env').DEIP_SERVER_URL,
        headers: {
          'Content-Type': 'application/json',
          'deip-application': this.proxydi.get('env').APP_ID
        }
      });
  }

  _handleErrors(error) {
    // console.error(error);

    const router = proxydi.get('routerInstance');
    const store = proxydi.get('storeInstance');

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        this.accessService.clearAccessToken();

        if (router && store) {
          router.push({ name: store.getters['auth/settings'].signInRedirectRouteName });
        } else {
          window.location.replace('/sign-in');
        }

        return false;
        // throw new Error(data);
      }
    }

    throw error;
  }

  _verb(method, url, model, options = {}) {
    this.axios.defaults.headers.common.Authorization = `Bearer ${this.accessService.getAccessToken()}`;

    return new Promise((resolve, reject) => {
      let httpPromise;

      switch (method) {
        case 'get':
          httpPromise = this.axios[method](url, options);
          break;
        case 'post':
          httpPromise = this.axios[method](url, model, options);
          break;
        case 'put':
          httpPromise = this.axios[method](url, model, options);
          break;
        case 'delete':
          httpPromise = this.axios[method](url, model, options);
          break;
        default:
          resolve();
          break;
      }

      const handleErrors = isFunction(options.handleErrors)
        ? options.handleErrors
        : this._handleErrors;

      httpPromise.then(
        (response) => {
          resolve(response.data);
        }
      )
        .catch(handleErrors)
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(url, options) {
    return this._verb('get', url, null, options);
  }

  post(url, model, options) {
    return this._verb('post', url, model, options);
  }

  put(url, model, options) {
    return this._verb('put', url, model, options);
  }

  delete_(url, model, options) {
    return this._verb('delete', url, model, options);
  }
}

export {
  HttpService
};

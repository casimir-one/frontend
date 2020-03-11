import { AppConfigService } from '@deip/app-config-service';
import { AccessService } from '@deip/access-service';
import axios from 'axios';

import { Singleton } from '@deip/toolbox';

class HttpService extends Singleton {
  accessService = AccessService.getInstance();

  appConfig = AppConfigService.getInstance();

  _axiosInstance;

  get axios() {
    return this._axiosInstance
      ? this._axiosInstance
      : this._axiosInstance = axios.create({
        baseURL: this.appConfig.get('env').DEIP_SERVER_URL,
        headers: { 'Content-Type': 'application/json' }
      });
  }

  _handleErrors(data, status) {
    switch (status) {
      case 401: // sign out unauthorized user
        this.accessService.clearAccessToken();
        window.location.replace('/sign-in');
        break;
      case 403: // redirect to "access denied" page
        this.accessService.clearAccessToken();
        window.location.replace('/sign-in');
        break;
      case 404: // redirect to "not-found" page
        // router.go("/not-found");
        break;
      case 503: // maintenance mode
        // router.go("/maintenance");
        break;
      default: // don't do anything, just pass errors to the controllers
        console.error(data);
        break;
    }
  }


  _verb(method, url, model, options) {
    if (!options) options = {};
    const config = { ...options };

    this.axios.defaults.headers.common.Authorization = `Bearer ${this.accessService.getAccessToken()}`;

    return new Promise((resolve, reject) => {
      let httpPromise;

      switch (method) {
        case 'get':
          httpPromise = this.axios[method](url, config);
          break;
        case 'post':
          httpPromise = this.axios[method](url, model, config);
          break;
        case 'put':
          httpPromise = this.axios[method](url, model, config);
          break;
        case 'delete':
          httpPromise = this.axios[method](url, config);
          break;
        default:
          resolve();
          break;
      }

      httpPromise.then(
        (response) => {
          // console.log(response);
          resolve(response.data);
        }
      )
        .catch(
          (error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              let isProcessed = false;
              if (options && typeof (options.handleErrors) === 'function'
                && status !== 503 /* maintenance */) {
                isProcessed = options.handleErrors(data, status);
              }
              if (!isProcessed) {
                this._handleErrors(error.response, error.response.status);
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
            } else {
              // Something happened in setting up the request that triggered an Error
            }
            console.error(error);
            reject(error);
          }
        );
    });
  }

  buildQueryString(obj, prefix) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        const k = prefix ? `${prefix}[${p}]` : p;
        const v = obj[p];

        if (v != null && typeof v === 'object') {
          str.push(this.buildQueryString(v, k).substr(1));
        } else {
          str.push(v || v === 0 || v === false ? `${k}=${encodeURIComponent(v)}` : `${k}=`);
        }
      }
    }
    return `?${str.join('&')}`;
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

  delete_(url, options) {
    return this._verb('delete', url, null, options);
  }
}

export {
  HttpService
};

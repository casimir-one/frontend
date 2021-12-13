import axios from 'axios';
import qs from 'qs';
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';
import { handleHttpError } from './HttpError';

export class HttpService {
  /**
   * @private
   * @type {AccessService | null}
   */
  _accessService = null;

  constructor() {
    this._accessService = AccessService.getInstance();
    const axiosInstance = this.makeAxiosInstance();
    this.setRequestInterceptors(axiosInstance);
    this.setResponseInterceptors(axiosInstance);
    this.addMethods(axiosInstance);
  }

  /**
   * @param {import("axios").AxiosRequestConfig?} config
   * @return {import("axios").AxiosInstance}
   */
  makeAxiosInstance(config = {}) {
    return axios.create(config);
  }

  /**
   * @param {import("axios").AxiosInstance} axiosInstance
   */
  setRequestInterceptors(axiosInstance) {
    axiosInstance.interceptors.request.use(
      async (originalConfig) => {
        const config = originalConfig;
        config.baseURL = proxydi.get('env')?.DEIP_SERVER_URL;
        const token = this._accessService.getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['deip-application'] = proxydi.get('env')?.APP_ID;
        return config;
      },
      (error) => {
        throw error;
      }
    );
  }

  logoutUser() {
    this._accessService.clearAccessToken();

    const router = proxydi.get('routerInstance');
    const store = proxydi.get('storeInstance');
    if (router && store) {
      const routeName = store.getters['auth/settings'].signInRedirectRouteName;
      router.push({ name: routeName });
    } else {
      window.location.replace('/sign-in');
    }
  }

  /**
   * @param {import("axios").AxiosInstance} axiosInstance
   */
  setResponseInterceptors(axiosInstance) {
    axiosInstance.interceptors.response.use(
      (response) => {
        if (!response) {
          throw new Error('Response is not provided');
        }

        return response.data.data || response.data;
      },
      async (responseError) => {
        if (axios.isCancel(responseError) || !responseError.config) {
          throw responseError;
        }

        const originalResponse = responseError.response;
        const status = originalResponse ? originalResponse.status : NaN;

        if (status === 401) {
          this.logoutUser();
        }

        throw handleHttpError(responseError);
      }
    );
  }

  /**
   * @param {import("axios").AxiosInstance} axiosInstance
   */
  addMethods(axiosInstance) {
    this.post = axiosInstance.post;
    this.delete = axiosInstance.delete;
    this.put = axiosInstance.put;
    this.get = axiosInstance.get;
  }

  /** @type {() => HttpService} */
  static getInstance = createInstanceGetter(HttpService);
}

/**
 * @param {object} params
 * @return {string}
 */
export const serializeParams = (params) => qs.stringify(params);

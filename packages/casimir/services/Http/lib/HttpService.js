import axios from 'axios';
import qs from 'qs';
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';
import { handleHttpError } from './HttpError';

/**
 * @typedef {import("axios").AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import("axios").AxiosInstance} AxiosInstance
 */

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
   * @param {AxiosRequestConfig?} config
   * @return {AxiosInstance}
   */
  makeAxiosInstance(config = {}) {
    return axios.create(config);
  }

  /**
   * @param {AxiosInstance} axiosInstance
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

    const router = proxydi.get('router');
    const store = proxydi.get('store');
    if (router && store) {
      const routeName = store.getters['auth/settings'].signInRedirectRouteName;
      router.push({ name: routeName });
    } else {
      window.location.replace('/sign-in');
    }
  }

  /**
   * @param {AxiosInstance} axiosInstance
   */
  setResponseInterceptors(axiosInstance) {
    axiosInstance.interceptors.response.use(
      (response) => {
        if (!response) {
          throw new Error('Response is not provided');
        }

        const { data, status } = response;
        return { status, ...data };
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
   * @param {AxiosInstance} axiosInstance
   */
  addMethods(axiosInstance) {
    /**
     * @type {(url: string, data?: any, config?: AxiosRequestConfig) => Promise<Object>}
     */
    this.post = axiosInstance.post;
    /**
     * @type {(url: string, config?: AxiosRequestConfig) => Promise<Object>}
     */
    this.delete = axiosInstance.delete;
    /**
     * @type {(url: string, data?: any, config?: AxiosRequestConfig) => Promise<Object>}
     */
    this.put = axiosInstance.put;
    /**
     * @type {(url: string, config?: import("axios").AxiosRequestConfig) => Promise<Object>}
     */
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

import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import * as qs from 'qs';
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';
import { handleHttpError } from './HttpError';

export class HttpService {
  private readonly _accessService: AccessService;

  get: <T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<R>;

  delete: <T = unknown, R = AxiosResponse<T>>(
    url: string, config?: AxiosRequestConfig
  ) => Promise<R>;

  post: <T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown, config?: AxiosRequestConfig
  ) => Promise<R>;

  put: <T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<R>;

  patch: <T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<R>;

  constructor() {
    this._accessService = AccessService.getInstance();
    const axiosInstance = this.makeAxiosInstance();
    // interceptors
    this.setRequestInterceptors(axiosInstance);
    this.setResponseInterceptors(axiosInstance);
    // methods
    this.get = axiosInstance.get;
    this.delete = axiosInstance.delete;
    this.post = axiosInstance.post;
    this.put = axiosInstance.put;
    this.patch = axiosInstance.patch;
  }

  makeAxiosInstance(config: AxiosRequestConfig = {}): AxiosInstance {
    return axios.create(config);
  }

  setRequestInterceptors(axiosInstance: AxiosInstance): void {
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
      },
    );
  }

  logoutUser(): void {
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

  setResponseInterceptors(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.response.use(
      (response) => {
        if (!response) {
          throw new Error('Response is not provided');
        }

        return response.data.data || response.data;
      },
      async (responseError: AxiosError) => {
        if (axios.isCancel(responseError) || !responseError.config) {
          throw responseError;
        }

        const originalResponse = responseError.response;
        const status = originalResponse ? originalResponse.status : NaN;

        if (status === 401) {
          this.logoutUser();
        }

        throw handleHttpError(responseError);
      },
    );
  }

  static getInstance = createInstanceGetter(HttpService) as () => HttpService;
}

export const serializeParams = (params: { [k: string]: unknown }): string => qs.stringify(params);

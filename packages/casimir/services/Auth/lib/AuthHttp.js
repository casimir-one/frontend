import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

/**
 * Auth HTTP transport
 */
export class AuthHttp {
  http = HttpService.getInstance();

  /**
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async signIn(data) {
    return this.http.post('/auth/sign-in/', data);
  }

  /**
   * Deprecated
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async adminSignIn(data) {
    return this.http.post('/portal/sign-in/', data);
  }

  /**
   * Create new user
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async signUp(req) {
    return this.http.post('/auth/v2/sign-up/', req.getHttpBody());
  }

  /** @type {() => AuthHttp} */
  static getInstance = createInstanceGetter(AuthHttp)
}

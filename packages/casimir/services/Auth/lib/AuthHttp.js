import { HttpService } from '@casimir/http-service';
import { makeSingletonInstance } from '@casimir/toolbox';

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

  /**
   * Check if user exists by username or email
   * @param {string} usernameOrEmail
   * @return {Promise<Object>}
   */
  async isExist(usernameOrEmail) {
    return this.http.get(`/auth/v2/exist/${usernameOrEmail}`);
  }

  /**
   * Create new user
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async importDao(req) {
    return this.http.post('/auth/v2/import-dao/', req.getHttpBody());
  }

  /** @type {() => AuthHttp} */
  static getInstance = makeSingletonInstance(() => new AuthHttp());
}

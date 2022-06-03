import decode from 'jwt-decode';
import { ACCESS_TOKEN_KEY, OWNER_PRIVATE_KEY, OWNER_PUBLIC_KEY } from '@deip/constants';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Manage JWT tokens
 */
export class AccessService {
  /**
   * Get expiration date for JWT token
   * @param {string} jwt
   * @return {null|Date}
   */
  getTokenExpirationDate(jwt) {
    const token = decode(jwt);
    if (!token.exp) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
  }

  /**
   * Check if JWT token expired
   * @param {string} jwt
   * @return {boolean}
   */
  isTokenExpired(jwt) {
    const expirationDate = this.getTokenExpirationDate(jwt);
    return expirationDate < new Date();
  }

  /**
   * @return {string}
   */
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * @return {string}
   */
  getOwnerPrivKey() {
    return localStorage.getItem(OWNER_PRIVATE_KEY);
  }

  /**
   * @return {string}
   */
  getOwnerPubKey() {
    return localStorage.getItem(OWNER_PUBLIC_KEY);
  }

  /**
   * Set keys in localstorage
   * @param {string} privKey
   * @param {string} pubKey
   */
  setOwnerKeysPair(privKey, pubKey) {
    localStorage.setItem(OWNER_PRIVATE_KEY, privKey);
    localStorage.setItem(OWNER_PUBLIC_KEY, pubKey);
  }

  /**
   * Clear tokens from localstorage
   */
  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(OWNER_PRIVATE_KEY);
    localStorage.removeItem(OWNER_PUBLIC_KEY);
  }

  /**
   * Set tokens to localstorage
   * @param {string} jwt
   * @param {string} privKey
   * @param {string} pubKey
   */
  setAccessToken(jwt, privKey, pubKey) {
    localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
    this.setOwnerKeysPair(privKey, pubKey);
  }

  /**
   * @return {boolean}
   */
  isLoggedIn() {
    const jwt = this.getAccessToken();
    return !!jwt && !this.isTokenExpired(jwt);
  }

  /**
   * @return {null|Object}
   */
  getDecodedToken() {
    const jwt = this.getAccessToken();
    if (!jwt) {
      return null;
    }
    return decode(jwt);
  }

  /**
   * @param {string} jwt
   * @return {Object}
   */
  decodedToken = (jwt) => decode(jwt)

  /** @type {() => AccessService} */
  static getInstance = makeSingletonInstance(() => new AccessService());
}

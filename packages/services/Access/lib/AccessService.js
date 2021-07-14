import decode from 'jwt-decode';
import { Singleton } from '@deip/toolbox';
// eslint-disable-next-line no-unused-vars
import { ACCESS_TOKEN_KEY, OWNER_PRIVATE_KEY } from '@deip/constants';

class AccessService extends Singleton {
  decode = decode;

  getTokenExpirationDate(jwt) {
    const token = this.decode(jwt);
    if (!token.exp) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
  }

  isTokenExpired(jwt) {
    const expirationDate = this.getTokenExpirationDate(jwt);
    return expirationDate < new Date();
  }

  /// ///////////

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getOwnerWif() {
    return localStorage.getItem(this.OWNER_PRIVATE_KEY);
  }

  setOwnerWif(wif) {
    return localStorage.setItem(this.OWNER_PRIVATE_KEY, wif);
  }

  clearAccessToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.OWNER_PRIVATE_KEY);
  }

  setAccessToken(jwt, wif) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, jwt);
    this.setOwnerWif(wif);
  }

  isLoggedIn() {
    const jwt = this.getAccessToken();
    return !!jwt && !this.isTokenExpired(jwt);
  }

  getDecodedToken() {
    const jwt = this.getAccessToken();
    if (!jwt) return null;
    return this.decode(jwt);
  }

  decodedToken = (jwt) => this.decode(jwt)
}

export {
  AccessService
};

import decode from 'jwt-decode';
import { Singleton } from '@deip/toolbox';
import { ACCESS_TOKEN_KEY, OWNER_PRIVATE_KEY } from '@deip/constants';

class AccessService extends Singleton {
  getTokenExpirationDate(jwt) {
    const token = decode(jwt);
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
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getOwnerWif() {
    return localStorage.getItem(OWNER_PRIVATE_KEY);
  }

  setOwnerWif(wif) {
    return localStorage.setItem(OWNER_PRIVATE_KEY, wif);
  }

  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(OWNER_PRIVATE_KEY);
  }

  setAccessToken(jwt, wif) {
    localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
    this.setOwnerWif(wif);
  }

  isLoggedIn() {
    const jwt = this.getAccessToken();
    return !!jwt && !this.isTokenExpired(jwt);
  }

  getDecodedToken() {
    const jwt = this.getAccessToken();
    if (!jwt) return null;
    return decode(jwt);
  }

  decodedToken = (jwt) => decode(jwt)
}

export {
  AccessService
};

import { ACCESS_TOKEN_KEY, OWNER_PRIVATE_KEY, OWNER_PUBLIC_KEY } from '@casimir.one/platform-core';
import { AccessService } from '../../lib/AccessService';

const accessService = AccessService.getInstance();

// eslint-disable-next-line max-len
const expiredDateJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTIxMDMzMzB9.18cVR-NGMy6pDlE31-DBMgirxCRS55NfxZhvagyGefk';

// eslint-disable-next-line max-len
const notExpiredDateJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjMzMjA5MDE0MDU4fQ.DQR-awJC0Taj42DFN0cmcbBwA5SkQtsagYZTMKCxcGE';

describe('AccessService :', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should be instance of AccessService', () => {
    expect(accessService).toBeInstanceOf(AccessService);
  });

  describe('decodedToken', () => {
    it('should return decoded token', () => {
      expect(accessService.decodedToken(expiredDateJwt))
        .toEqual({ exp: 1652103330 });
    });
  });

  describe('setAccessToken', () => {
    it('should set jwt, private key and public key in localStorage', () => {
      accessService.setAccessToken('testJWT', 'testPrivKey', 'testPubKey');

      expect(localStorage.getItem(ACCESS_TOKEN_KEY))
        .toBe('testJWT');
      expect(localStorage.getItem(OWNER_PRIVATE_KEY))
        .toBe('testPrivKey');
      expect(localStorage.getItem(OWNER_PUBLIC_KEY))
        .toBe('testPubKey');
    });
  });

  describe('clearAccessToken', () => {
    it('should clear jwt and keys from localStorage', () => {
      accessService.setAccessToken('testJWT', 'testPrivKey', 'testPubKey');
      accessService.clearAccessToken();

      expect(localStorage.getItem(ACCESS_TOKEN_KEY))
        .toBe(null);
      expect(localStorage.getItem(OWNER_PRIVATE_KEY))
        .toBe(null);
      expect(localStorage.getItem(OWNER_PUBLIC_KEY))
        .toBe(null);
    });
  });

  describe('getTokenExpirationDate', () => {
    it('Should return null if no expire date in Jwt', () => {
      // eslint-disable-next-line max-len
      const testJwtWithoutExpireDate = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(accessService.getTokenExpirationDate(testJwtWithoutExpireDate)).toBe(null);
    });

    it('Should return expire date from Jwt', () => {
      const expectedDate = 1652103330000;
      expect(accessService.getTokenExpirationDate(expiredDateJwt).getTime()).toBe(expectedDate);
    });
  });

  describe('isTokenExpired', () => {
    it('Should return return false if token is expired', () => {
      expect(accessService.isTokenExpired(expiredDateJwt)).toBeTrue();
    });

    it('should return return true if token is not expired', () => {
      expect(accessService.isTokenExpired(notExpiredDateJwt)).toBeFalse();
    });
  });

  describe('getDecodedToken', () => {
    it('should return null if there is no jwt in store ', () => {
      expect(accessService.getDecodedToken()).toBe(null);
    });

    it('should return decoded token if it exist', () => {
      localStorage.setItem(ACCESS_TOKEN_KEY, expiredDateJwt);
      expect(accessService.getDecodedToken()).toEqual({ exp: 1652103330 });
    });
  });

  describe('isLoggedIn', () => {
    it('should return false if no jwt', () => {
      expect(accessService.isLoggedIn()).toBeFalse();
    });

    it('should return false if jwt is expired', () => {
      localStorage.setItem(ACCESS_TOKEN_KEY, expiredDateJwt);
      expect(accessService.isLoggedIn()).toBeFalse();
    });

    it('should return true if jwt not expired', () => {
      localStorage.setItem(ACCESS_TOKEN_KEY, notExpiredDateJwt);
      expect(accessService.isLoggedIn()).toBeTrue();
    });
  });
});

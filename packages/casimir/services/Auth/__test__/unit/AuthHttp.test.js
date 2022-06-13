import { AuthHttp } from '../../lib/AuthHttp';

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock('@deip/http-service', () => ({
  HttpService: {
    getInstance: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut
    })
  }
}));

const authHttp = AuthHttp.getInstance();
describe('AuthHttp', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be instance of AuthHttp', () => {
    expect(authHttp).toBeInstanceOf(AuthHttp);
  });

  describe('signIn', () => {
    it('should call post request with right url and data', () => {
      const testUrl = '/auth/sign-in/';
      const testData = 'testData';
      authHttp.signIn(testData);

      expect(mockPost).toBeCalledWith(testUrl, testData);
    });
  });

  describe('adminSignIn', () => {
    it('should call post request with right url and data', () => {
      const testUrl = '/portal/sign-in/';
      const testData = 'testData';
      authHttp.adminSignIn(testData);

      expect(mockPost).toBeCalledWith(testUrl, testData);
    });
  });

  describe('signUp', () => {
    it('should call post request with right url and data', () => {
      const testUrl = '/auth/v2/sign-up/';
      const testRequestBody = 'requestBody';
      const testRequest = {
        getHttpBody: () => testRequestBody
      };
      authHttp.signUp(testRequest);

      expect(mockPost).toBeCalledWith(testUrl, testRequestBody);
    });
  });
});

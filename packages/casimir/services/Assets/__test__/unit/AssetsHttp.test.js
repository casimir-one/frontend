import { AssetsHttp } from '../../lib/AssetsHttp';

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('@deip/http-service', () => ({
  HttpService: {
    getInstance: () => ({
      get: mockGet,
      post: mockPost
    })
  },
  serializeParams: ({ status }) => `testQuery${status}`
}));

const assetsHttp = AssetsHttp.getInstance();

describe('AssetsHttp', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create instance', () => {
    expect(assetsHttp).toBeInstanceOf(AssetsHttp);
  });

  describe('getAccountDepositHistory', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/assets/deposit/history/account/testAccount?testQueryTestStatus';
      assetsHttp.getAccountDepositHistory('testAccount', 'TestStatus');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getAssetsByType', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/assets/type/testType';
      assetsHttp.getAssetsByType('testType');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getAssetsByIssuer', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/assets/issuer/testIssuer';
      assetsHttp.getAssetsByIssuer('testIssuer');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('lookupAssets', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/assets/limit/testLimit';
      assetsHttp.lookupAssets('testLimit');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('deposit', () => {
    it('should call post request with right url', () => {
      const testUrl = '/webhook/assets/deposit';
      const testDeposit = 'testDeposit';
      assetsHttp.deposit(testDeposit);

      expect(mockPost).toBeCalledWith(testUrl, testDeposit);
    });
  });
});

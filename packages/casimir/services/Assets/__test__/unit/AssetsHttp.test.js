import { AssetsHttp } from '../../lib/AssetsHttp';

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('@casimir/http-service', () => ({
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
});

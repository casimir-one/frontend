import { AttributesHttp } from '../../lib/AttributesHttp';

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

const attributesHttp = AttributesHttp.getInstance();

describe('AttributesHttp :', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be instance of AttributesHttp', () => {
    expect(attributesHttp).toBeInstanceOf(AttributesHttp);
  });

  describe('getList', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attributes';
      attributesHttp.getList();

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getOne', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attribute/testId';
      attributesHttp.getOne('testId');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getListByScope', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attributes/scope/testScope';
      attributesHttp.getListByScope('testScope');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getNetworkAttributesByScope', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attributes/scope/network/testAttributeScope';
      attributesHttp.getNetworkAttributesByScope('testAttributeScope');

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getNetworkAttributes', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attributes/network';
      attributesHttp.getNetworkAttributes();

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('getSystemAttributes', () => {
    it('should call get request with right url', () => {
      const testUrl = '/api/v2/attributes/system';
      attributesHttp.getSystemAttributes();

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('create', () => {
    it('should call post request with right url and body', () => {
      const testUrl = '/api/v2/attribute';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.create(testReq);

      expect(mockPost).toBeCalledWith(testUrl, testBody);
    });
  });

  describe('update', () => {
    it('should call update request with right url and body', () => {
      const testUrl = '/api/v2/attribute';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.update(testReq);

      expect(mockPut).toBeCalledWith(testUrl, testBody);
    });
  });

  describe('update', () => {
    it('should call put request with right url and body', () => {
      const testUrl = '/api/v2/attribute';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.update(testReq);

      expect(mockPut).toBeCalledWith(testUrl, testBody);
    });
  });

  describe('update', () => {
    it('should call put request with right url and body', () => {
      const testUrl = '/api/v2/attribute';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.update(testReq);

      expect(mockPut).toBeCalledWith(testUrl, testBody);
    });
  });

  describe('delete', () => {
    it('should call put request with right url and body', () => {
      const testUrl = '/api/v2/attribute/delete';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.delete(testReq);

      expect(mockPut).toBeCalledWith(testUrl, testBody);
    });
  });

  describe('getSettings', () => {
    it('should call get request with right url', () => {
      const testUrl = '/portal/settings/attribute-settings';
      attributesHttp.getSettings();

      expect(mockGet).toBeCalledWith(testUrl);
    });
  });

  describe('updateSettings', () => {
    it('should call put request with right url and body', () => {
      const testUrl = '/portal/settings/attribute-settings';
      const testBody = 'testBody';
      const testReq = {
        getHttpBody: () => testBody
      };
      attributesHttp.updateSettings(testReq);

      expect(mockPut).toBeCalledWith(testUrl, testBody);
    });
  });
});

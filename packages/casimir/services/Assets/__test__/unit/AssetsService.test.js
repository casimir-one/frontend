import { AssetsService } from '../../lib/AssetsService';

const mockGetAccountDepositHistory = jest.fn();
const mockGetAssetsByType = jest.fn();
const mockGetAssetsByIssuer = jest.fn();
const mockLookupAssets = jest.fn();
const mockDeposit = jest.fn();

jest.mock('../../lib/AssetsHttp', () => ({
  AssetsHttp: {
    getInstance: () => ({
      getAccountDepositHistory: mockGetAccountDepositHistory,
      getAssetsByType: mockGetAssetsByType,
      getAssetsByIssuer: mockGetAssetsByIssuer,
      lookupAssets: mockLookupAssets,
      deposit: mockDeposit
    })
  }
}));

jest.mock('@deip/proxydi', () => ({
  proxydi: {
    get: () => 'testEnv'
  }
}));

jest.mock('@deip/chain-service', () => ({
  ChainService: {
    getInstanceAsync: () => new Promise((resolve) => {
      resolve({
        generateChainSeedAccount: () => ({ signString: () => 'testSigHex' })
      });
    })
  }
}));

const assetsService = AssetsService.getInstance();

describe('AssetsService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create instance', () => {
    expect(assetsService).toBeInstanceOf(AssetsService);
  });

  describe('getAccountDepositHistory', () => {
    it('should call getAccountDepositHistory from assetsHttp with right params', () => {
      assetsService.getAccountDepositHistory('testAccount', 'testStatus');

      expect(mockGetAccountDepositHistory).toBeCalledWith('testAccount', 'testStatus');
    });
  });

  describe('getAssetsByType', () => {
    it('should call getAssetsByType from assetsHttp with right params', () => {
      assetsService.getAssetsByType('testType');

      expect(mockGetAssetsByType).toBeCalledWith('testType');
    });
  });

  describe('getAssetsByIssuer', () => {
    it('should call getAssetsByIssuer from assetsHttp with right params', () => {
      assetsService.getAssetsByIssuer('testIssuer');

      expect(mockGetAssetsByIssuer).toBeCalledWith('testIssuer');
    });
  });

  describe('lookupAssets', () => {
    it('should call lookupAssets from assetsHttp with right params', () => {
      assetsService.lookupAssets('testLimit');

      expect(mockLookupAssets).toBeCalledWith('testLimit');
    });
  });

  describe('deposit', () => {
    it('should prepare and call assetsHttp.deposit with right params ', async () => {
      const testPayload = {
        initiator: { privKey: 'testPrivKey', username: 'testUserName' },
        redirectUrl: 'testRedirectUrl',
        amount: 'testAmount',
        currency: 'testCurrency',
        account: 'testAccount',
        timestamp: 'testTimestamp'
      };
      const expectedDepositData = {
        account: 'testAccount',
        amount: 'testAmount',
        currency: 'testCurrency',
        redirectUrl: 'testRedirectUrl',
        sigHex: 'testSigHex',
        sigSource: '{"account":"testAccount","amount":"testAmount","currency":"testCurrency",'
          + '"timestamp":"testTimestamp"}',
        timestamp: 'testTimestamp'
      };
      await assetsService.deposit(testPayload);
      expect(mockDeposit).toBeCalledWith(expectedDepositData);
    });
  });
});

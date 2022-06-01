import { proxydi } from '@deip/proxydi';
import { CreateDaoCmd } from '@deip/commands';
import { AuthService } from '../../lib/AuthService';

const mockSignIn = jest.fn();
const mockAdminSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockEnd = jest.fn();

jest.mock('@deip/toolbox', () => ({
  ...jest.requireActual('@deip/toolbox'),
  genSha256Hash: () => 'testHash'
}));

jest.mock('@deip/commands');

jest.mock('../../lib/AuthHttp.js', () => ({
  AuthHttp: {
    getInstance: () => ({
      signIn: mockSignIn,
      adminSignIn: mockAdminSignIn,
      signUp: mockSignUp
    })
  }
}));

jest.mock('@deip/chain-service', () => ({
  ChainService: {
    getInstanceAsync: () => new Promise((resolve) => resolve({
      getChainNodeClient: jest.fn(),
      getChainTxBuilder: () => ({
        begin: jest.fn().mockReturnValue({
          addCmd: jest.fn(),
          end: mockEnd
        })
      })
    }))
  }
}));

jest.mock('@deip/proxydi', () => ({
  proxydi: {
    get: () => ({ CORE_ASSET: {}, FAUCET_ACCOUNT_USERNAME: 'testFaucetAccountUsername' })
  }
}));

jest.mock('@deip/messages', () => ({
  // eslint-disable-next-line object-shorthand,func-names
  JsonDataMsg: function () {
    return { message: 'testMessage' };
  }
}));

const authService = AuthService.getInstance();

describe('AuthService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be instance of AuthService', () => {
    expect(authService).toBeInstanceOf(AuthService);
  });

  describe('signIn', () => {
    it('should call AuthHttp.signIn with right data', () => {
      authService.signIn('testData');
      expect(mockSignIn).toBeCalledWith('testData');
    });
  });

  describe('adminSignIn', () => {
    it('should call AuthHttp.adminSignIn with right data', () => {
      authService.adminSignIn('testData');
      expect(mockAdminSignIn).toBeCalledWith('testData');
    });
  });

  describe('signUp', () => {
    const testUserData = {
      email: 'testEmail',
      attributes: [],
      username: 'testUsername',
      pubKey: 'testPub',
      roles: ['testRole']
    };

    describe('for isAuthorizedCreatorRequired false', () => {
      const testInitiator = {
        privKey: 'testPubKey',
        isAuthorizedCreatorRequired: false
      };

      it('should create new CreateDaoCmd with right data when attributes are empty', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue({});
        mockEnd.mockReturnValue({
          signAsync: jest.fn().mockReturnValue({
            getPayload: jest.fn()
          })
        });
        await authService.signUp(testInitiator, testUserData);

        expect(CreateDaoCmd.mock.calls.length).toBe(1);
        expect(CreateDaoCmd.mock.calls[0][0]).toEqual({
          attributes: [],
          authority: {
            owner: {
              auths: [
                {
                  key: 'testPub',
                  weight: 1
                }
              ],
              weight: 1
            }
          },
          creator: 'testUsername',
          description: 'testHash',
          email: 'testEmail',
          entityId: 'testUsername',
          fee: {
            amount: 0
          },
          isTeamAccount: false,
          roles: [
            'testRole'
          ]
        });
      });

      it('should create new CreateDaoCmd with right attributes if they are not empty', async () => {
        const testUserDataWithAttributes = {
          ...testUserData,
          attributes: ['firstAttribute', 'lolcat']
        };

        jest.spyOn(proxydi, 'get').mockReturnValue({});
        mockEnd.mockReturnValue({
          signAsync: jest.fn().mockReturnValue({
            getPayload: jest.fn()
          })
        });

        await authService.signUp(testInitiator, testUserDataWithAttributes);

        expect(CreateDaoCmd.mock.calls.length).toBe(1);
        expect(CreateDaoCmd.mock.calls[0][0].attributes).toEqual([
          'firstAttribute',
          'lolcat'
        ]);
      });

      it('should call signAsync for not AuthorizedCreator', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue({});
        const mockSingAsync = jest.fn().mockReturnValue({
          getPayload: jest.fn()
        });
        mockEnd.mockReturnValue({
          signAsync: mockSingAsync
        });

        await authService.signUp(testInitiator, testUserData);
        expect(mockSingAsync).toBeCalled();
      });
    });

    describe('for isAuthorizedCreatorRequired true', () => {
      const testInitiator = {
        privKey: 'testPubKey',
        isAuthorizedCreatorRequired: true
      };

      it('should create new CreateDaoCmd with right data when attributes are empty', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue(
          { FAUCET_ACCOUNT_USERNAME: 'testFaucetAccountUsername' }
        );
        mockEnd.mockReturnValue({
          getPayload: jest.fn()
        });
        await authService.signUp(testInitiator, testUserData);

        expect(CreateDaoCmd.mock.calls.length).toBe(1);
        expect(CreateDaoCmd.mock.calls[0][0]).toEqual({
          attributes: [],
          authority: {
            owner: {
              auths: [
                {
                  key: 'testPub',
                  weight: 1
                }
              ],
              weight: 1
            }
          },
          creator: 'testFaucetAccountUsername',
          description: 'testHash',
          email: 'testEmail',
          entityId: 'testUsername',
          fee: {
            amount: 0
          },
          isTeamAccount: false,
          roles: [
            'testRole'
          ]
        });
      });

      it('should call getPayload for finalizedTx, '
        + 'and not call for finalizedTx.signAsync ', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue({});
        const mockSingAsync = jest.fn();
        const mockGetPayload = jest.fn();
        mockEnd.mockReturnValue({
          signAsync: mockSingAsync,
          getPayload: mockGetPayload
        });

        await authService.signUp(testInitiator, testUserData);
        expect(mockSingAsync).not.toBeCalled();
        expect(mockGetPayload).toBeCalled();
      });

      it('Should send message if RETURN_MSG true', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue({
          RETURN_MSG: true
        });
        mockEnd.mockReturnValue({
          getPayload: jest.fn()
        });

        const result = await authService.signUp(testInitiator, testUserData);
        expect(result).toEqual({ message: 'testMessage' });
        expect(mockSignUp).not.toHaveBeenCalled();
      });

      it('Should send http.singUp with message if RETURN_MSG false', async () => {
        jest.spyOn(proxydi, 'get').mockReturnValue({
          RETURN_MSG: false
        });
        mockEnd.mockReturnValue({
          getPayload: jest.fn()
        });

        await authService.signUp(testInitiator, testUserData);
        expect(mockSignUp).toHaveBeenCalledWith({ message: 'testMessage' });
      });
    });
  });
});

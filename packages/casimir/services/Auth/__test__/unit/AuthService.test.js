import { AuthService } from '../../lib/AuthService';

const mockSignIn = jest.fn();
const mockAdminSignIn = jest.fn();

jest.mock('../../lib/AuthHttp.js', () => ({
  AuthHttp: {
    getInstance: () => ({
      signIn: mockSignIn,
      adminSignIn: mockAdminSignIn

    })
  }
}));

jest.mock('@deip/proxydi', () => ({
  proxydi: {
    get: () => ({ CORE_ASSET: {}, FAUCET_ACCOUNT_USERNAME: 'testFaucetAccountUsername' })
  }
}));

const authService = AuthService.getInstance();

describe('AuthService', () => {
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
      expect(mockSignIn).toBeCalledWith('testData');
    });
  });
});

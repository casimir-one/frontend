import { Singleton } from '@deip/toolbox';
import { AuthHttp } from './AuthHttp';

class AuthService extends Singleton {
  $http = AuthHttp.getInstance();

  signIn(model) {
    return this.$http.signIn(model);
  }

  adminSignIn(model) {
    return this.$http.adminSignIn(model);
  }

  preliminaryRegistration(model) {
    return this.$http.preliminaryRegistration(model);
  }

  signUp(model) {
    return this.$http.signUp(model);
  }
}

export {
  AuthService
};

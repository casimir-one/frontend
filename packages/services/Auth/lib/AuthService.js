import { AuthHttp } from "./AuthHttp";
import { Singleton } from '@deip/toolbox';

class AuthService extends Singleton  {
  $http = AuthHttp.getInstance();

  constructor() {
    super();

    console.log('Auth', 'constructed');
  }

  signIn(model) {
    return this.$http.signIn(model);
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
}

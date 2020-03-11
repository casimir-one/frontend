import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class AuthHttp extends Singleton {
  http = HttpService.getInstance();

  signIn(model) {
    return this.http.post('/auth/sign-in/', model);
  }

  preliminaryRegistration(model) {
    return this.http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
  }

  signUp(model) {
    return this.http.post('/auth/sign-up/', model);
  }
}

export {
  AuthHttp
};

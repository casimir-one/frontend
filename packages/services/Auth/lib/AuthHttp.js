import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class AuthHttp extends Singleton {
  http = HttpService.getInstance();

  signIn(model) {
    return this.http.post('/auth/sign-in/', model);
  }

  adminSignIn(model) {
    return this.http.post('/tenant/sign-in/', model);
  }

  signUp(req) {
    return this.http.post('/auth/v2/sign-up/', req.getHttpBody());
  }
}

export {
  AuthHttp
};

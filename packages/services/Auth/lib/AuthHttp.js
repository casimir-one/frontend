import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class AuthHttp {
  http = HttpService.getInstance();

  async signIn(model) {
    return this.http.post('/auth/sign-in/', model);
  }

  async adminSignIn(model) {
    return this.http.post('/tenant/sign-in/', model);
  }

  async signUp(req) {
    return this.http.post('/auth/v2/sign-up/', req.getHttpBody());
  }

  /** @type {() => AuthHttp} */
  static getInstance = createInstanceGetter(AuthHttp)
}

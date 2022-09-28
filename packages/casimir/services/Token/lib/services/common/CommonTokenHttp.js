import { HttpService } from '@casimir.one/http-service';
import { makeSingletonInstance } from '@casimir.one/toolbox';

/**
 * Token http transport
 */
export class CommonTokenHttp {
  http = HttpService.getInstance();

  /**
   * Create proposal for swap tokens
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createTokensSwapProposal(req) {
    return this.http.post('/api/v2/tokens/swap', req.getHttpBody());
  }

  /** @type {() => CommonTokenHttp} */
  static getInstance = makeSingletonInstance(() => new CommonTokenHttp());
}
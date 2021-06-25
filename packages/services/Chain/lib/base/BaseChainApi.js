import { Interface } from '@deip/toolbox';

/* Keep args in functions to validate interface */

const ChainApi = Interface('ChainApi', {
  getProjectAsync: async function (projectId) { },
});


class BaseChainApi {
  constructor(impl) {
    Interface.implement(impl, ChainApi);
    return impl;
  }
}


export default BaseChainApi;
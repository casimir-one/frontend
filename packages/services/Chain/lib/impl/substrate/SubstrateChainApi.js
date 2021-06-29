import BaseChainApi from './../../base/BaseChainApi';


class SubstrateChainApi extends BaseChainApi {

  constructor(chainService) {
    const api = {
      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("deipStorage_getProject", [null, `0x${projectId}`]);
      }
    };

    return super(api);
  }
}


export default SubstrateChainApi;
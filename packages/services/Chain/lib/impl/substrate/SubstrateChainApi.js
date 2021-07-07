import BaseChainApi from './../../base/BaseChainApi';


class SubstrateChainApi extends BaseChainApi {

  constructor(chainService) {
    const api = {
      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode('author_submitExtrinsic', [rawTx]);
      },
      
      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("deipStorage_getProject", [null, `0x${projectId}`]);
      }
    };

    return super(api);
  }
}


export default SubstrateChainApi;
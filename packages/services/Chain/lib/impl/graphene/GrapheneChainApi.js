import BaseChainApi from './../../base/BaseChainApi';


class GrapheneChainApi extends BaseChainApi {

  constructor(chainService) {
    const api = {
      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_transaction_synchronous", [rawTx]]);
      },
      
      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research", [projectId]]);
      },

      getProjectsAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_researches", [0, 10000]]);
      }

    };

    return super(api);
  }
}


export default GrapheneChainApi;
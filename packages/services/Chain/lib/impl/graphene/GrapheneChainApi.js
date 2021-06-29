import BaseChainApi from './../../base/BaseChainApi';


class GrapheneChainApi extends BaseChainApi {

  constructor(chainService) {
    const api = {
      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research", [projectId]]);
      }
    };

    return super(api);
  }
}


export default GrapheneChainApi;
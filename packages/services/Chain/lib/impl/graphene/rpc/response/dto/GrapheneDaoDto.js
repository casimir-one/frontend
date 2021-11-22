import DaoDto from './../../../../../base/rpc/response/dto/DaoDto';


class GrapheneDaoDto extends DaoDto {

  constructor(dao) {
    const daoId = dao.name;
    const keyAuths = dao.owner.key_auths.map(([pubKey, weight]) => ({ pubKey, weight }));
    const accountAuths = dao.owner.account_auths.map(([daoId, weight]) => ({ daoId, weight }));
    const threshold = dao.owner.weight_threshold;
    const authority = {
      owner: {
        auths: [...keyAuths, ...accountAuths],
        threshold: threshold
      }
    };
    const metadata = dao.json_metadata;

    super({ 
      daoId, 
      authority, 
      metadata 
    });
  }

}


export default GrapheneDaoDto;
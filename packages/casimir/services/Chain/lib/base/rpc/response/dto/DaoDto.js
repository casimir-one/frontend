import { assert } from '@casimir/toolbox';


class DaoDto {

  constructor({
    daoId,
    authority,
    metadata
  }) {
    
    assert(!!daoId, "Dao ID is not specified");
    assert(!!authority && !!authority.owner && !!authority.owner.auths && authority.owner.auths.length && authority.owner.threshold, 
      "Dao owner authority or the threshold is not specified");

    this.daoId = daoId;
    this.name = daoId; // @deprecated
    this.authority = authority;
    this.metadata = metadata || null;
  }

}


export default DaoDto;

import DaoDto from './../../../../../base/rpc/response/dto/DaoDto';
import { fromHexFormat } from './../../../utils';


class SubstrateDaoDto extends DaoDto {

  constructor(dao) {
    const daoId = fromHexFormat(dao.id);
    const auths = dao.foundSignatories.map((signatory) => (signatory.daoId 
      ? { daoId: fromHexFormat(signatory.daoId), weight: 1 }
      : { pubKey: fromHexFormat(signatory.pubKey), weight: 1 }
    ));
    const threshold = dao.authority.threshold;
    const authority = {
      owner: {
        auths: [...auths],
        threshold: threshold === 0 ? 1 : threshold // substrate uses 0 threshold for a single signature
      }
    };
    const metadata = fromHexFormat(dao.metadata);
    
    super({ 
      daoId, 
      authority, 
      metadata 
    });
  }

}


export default SubstrateDaoDto;
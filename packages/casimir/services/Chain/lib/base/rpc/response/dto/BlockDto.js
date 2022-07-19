import { assert } from '@deip/toolbox';


class BlockDto {

  constructor({
    number,
    hash,
    extrinsicHashes
  }) {

    assert(!!number, "Block 'number' is not specified");
    assert(!!hash, "Block 'hash' is not specified");
    assert(!!extrinsicHashes, "Block 'extrinsicHashes' is not specified"); 

    this.number = number;
    this.hash = hash;
    this.extrinsicHashes = extrinsicHashes;
  }

}


export default BlockDto;

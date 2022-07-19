import BlockDto from '../../../../../base/rpc/response/dto/BlockDto';


class SubstrateBlockDto extends BlockDto {

  constructor(block) {
    const {
      createdAtHash,
      block: {
        header: { number },
        extrinsics
      }
    } = block;

    super({
      number: number.toString(),
      hash: createdAtHash.toString(),
      //extinsicsHashes it's substrate block specific field, should it be removed from BlockDto to SubstrateBlockDto?
      extrinsicHashes: extrinsics.map(({ hash }) => hash.toHex()), //TODO: check if it's correct
      extrinsics: extrinsics
    });
  }

}


export default SubstrateBlockDto;
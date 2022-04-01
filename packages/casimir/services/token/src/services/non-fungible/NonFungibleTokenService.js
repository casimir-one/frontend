import { createInstanceGetter, genSha256Hash } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import {
  TransferNonFungibleTokenCmd,
  CreateNonFungibleTokenCmd,
  IssueNonFungibleTokenCmd
} from '@deip/commands';
import { APP_PROPOSAL } from '@deip/constants';
import { ChainService } from '@deip/chain-service';
import { NonFungibleTokenHttp } from './NonFungibleTokenHttp';
import { transferToken, updateProposalInfo } from '../../util';

export class NonFungibleTokenService {
  proxydi = proxydi;

  nonFungibleTokenHttp = NonFungibleTokenHttp.getInstance();

  /**
   * Create new non-fungible token
   * @param {import('@casimir/platform-core').NonFungibleTokenCreatePayload} payload
   * @return {Promise<Object>}
   */
  async create(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        name,
        metadata = {},
        description,
        holders
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const metadataHash = genSha256Hash(metadata);
            const createNonFungibleTokenCmd = new CreateNonFungibleTokenCmd({
              issuer,
              name,
              description,
              metadata,
              metadataHash
            });

            txBuilder.addCmd(createNonFungibleTokenCmd);
            const tokenId = createNonFungibleTokenCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const {
                  account: recipient,
                  metadata: instanceMetadata = {},
                  instanceId
                } = holders[i];
                const instanceMetadataHash = genSha256Hash(instanceMetadata);
                const issueNonFungibleTokenCmd = new IssueNonFungibleTokenCmd({
                  issuer,
                  classId: tokenId,
                  instanceId: instanceId || i + 1,
                  recipient,
                  metadata: instanceMetadata,
                  metadataHash: instanceMetadataHash
                });
                txBuilder.addCmd(issueNonFungibleTokenCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.nonFungibleTokenHttp.create(msg);
          });
      });
  }

  /**
   * Issue non-fungible token
   * @param {import('@casimir/platform-core').NonFungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  async issue(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        classId,
        instanceId,
        recipient,
        metadata
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const metadataHash = genSha256Hash(metadata);
            const issueNonFungibleTokenCmd = new IssueNonFungibleTokenCmd({
              issuer,
              classId,
              instanceId,
              recipient,
              metadata,
              metadataHash
            });
            txBuilder.addCmd(issueNonFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.nonFungibleTokenHttp.issue(msg);
          });
      });
  }

  /**
   * Transfer non-fungible token
   * @param{import('@casimir/platform-core').NonFungibleTokenTransferPayload} payload
   * @return {Promise<Object>}
   */
  async transfer(payload) {
    const transferPayload = updateProposalInfo(payload);

    const {
      data: { from, to, token }
    } = transferPayload;

    const transferTokenCmd = new TransferNonFungibleTokenCmd({
      from,
      to,
      classId: token.classId,
      instanceId: token.instanceId
    });

    return transferToken(
      transferPayload,
      transferTokenCmd,
      APP_PROPOSAL.NFT_TRANSFER_PROPOSAL,
      this.nonFungibleTokenHttp.transfer
    );
  }

  /**
   * Get non-fungible token
   * @param {string} classId
   * @return {Promise<Object>}
   */
  async getClass(classId) {
    return this.nonFungibleTokenHttp.getClass(classId);
  }

  /**
   * Get non-fungible tokens
   * @return {Promise<Object>}
   */
  async getClasses() {
    return this.nonFungibleTokenHttp.getClasses();
  }

  /**
   * Get non-fungible token instances by owner and non-fungible token
   * @param {string} account
   * @param {string} classId
   * @return {Promise<Object>}
   */
  async geClassInstancesByOwner(account, classId) {
    return this.nonFungibleTokenHttp.geClassInstancesByOwner(account, classId);
  }

  /**
   * Get non-fungible token instances by owner
   * @param {string} account
   * @return {Promise<Object>}
   */
  async getClassesInstancesByOwner(account) {
    return this.nonFungibleTokenHttp.getClassesInstancesByOwner(account);
  }

  /** @type {() => NonFungibleTokenService} */
  static getInstance = createInstanceGetter(NonFungibleTokenService);
}

import { makeSingletonInstance } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import {
  TransferFTCmd,
  CreateFTClassCmd,
  IssueFTCmd
} from '@deip/commands';
import { APP_PROPOSAL } from '@casimir/platform-core';
import { ChainService } from '@deip/chain-service';
import { FungibleTokenHttp } from './FungibleTokenHttp';
import { transferToken, updateProposalInfo } from '../../util';

/**
 * Fungible token service
 */
export class FungibleTokenService {
  proxydi = proxydi;

  fungibleTokenHttp = FungibleTokenHttp.getInstance();

  /**
   * Create new fungible token
   * @param {import('@casimir/platform-core').FungibleTokenCreatePayload} payload
   * @return {Promise<Object>}
   */
  async create(payload) {
    const {
      initiator: { privKey },
      data: {
        symbol,
        issuer,
        precision,
        maxSupply,
        minBalance,
        description,
        metadata,
        holders
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainRpc = chainService.getChainRpc();

        return chainTxBuilder.begin()
          .then(async (txBuilder) => {
            const entityId = await chainRpc.getNextAvailableFtId();

            const createFTClassCmd = new CreateFTClassCmd({
              entityId,
              issuer,
              symbol,
              precision,
              maxSupply,
              minBalance,
              description,
              metadata
            });
            txBuilder.addCmd(createFTClassCmd);
            const tokenId = createFTClassCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const { account, asset } = holders[i];
                const issueFTCmd = new IssueFTCmd({
                  tokenId,
                  amount: asset.amount,
                  issuer,
                  recipient: account
                });
                txBuilder.addCmd(issueFTCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.fungibleTokenHttp.create(msg);
          });
      });
  }

  /**
   * Issue fungible token
   * @param {import('@casimir/platform-core').FungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  async issue(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        tokenId,
        amount,
        recipient
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const issueFTCmd = new IssueFTCmd({
              issuer,
              tokenId,
              amount,
              recipient
            });
            txBuilder.addCmd(issueFTCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.fungibleTokenHttp.issue(msg);
          });
      });
  }

  /**
   * Transfer fungible token
   * @param {import('@casimir/platform-core').FungibleTokenTransferPayload} payload
   * @return {Promise<Object>}
   */
  async transfer(payload) {
    const transferPayload = updateProposalInfo(payload);

    const {
      data: { from, to, token }
    } = transferPayload;

    const transferTokenCmd = new TransferFTCmd({
      from,
      to,
      tokenId: token.id,
      amount: token.amount
    });

    return transferToken(
      transferPayload,
      transferTokenCmd,
      APP_PROPOSAL.FT_TRANSFER_PROPOSAL,
      this.fungibleTokenHttp.transfer
    );
  }

  /**
   * Get certain asset information
   * @param {string} id
   * @return {Promise<Object>}
   */
  async getOne(id) {
    return this.fungibleTokenHttp.getOne(id);
  }

  /**
   * Get asset information by asset symbol
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getOneBySymbol(symbol) {
    return this.fungibleTokenHttp.getOneBySymbol(symbol);
  }

  /**
   * Get assets by tokens issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  async getListByIssuer(issuer) {
    return this.fungibleTokenHttp.getListByIssuer(issuer);
  }

  /**
   * Get list of fungible tokens
   * @param {number} limit
   * @param {string} lowerBoundSymbol
   * @return {Promise<Object>}
   */
  async getList(limit = 10000, lowerBoundSymbol = '') {
    return this.fungibleTokenHttp.getList(limit, lowerBoundSymbol);
  }

  /**
   * Get dao balance for certain account
   * @param {string} address
   * @return {Promise<object>}
   */
  async getAccountDaoBalance(address) {
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainRpc = chainService.getChainRpc();

    return chainRpc
      .getFungibleTokenBalanceByOwnerAsync(address, 0);
  }

  /**
   * Get fungible tokens balances by symbol for certain account
   * @param {string} owner
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountBalance(owner, symbol) {
    return this.fungibleTokenHttp.getAccountBalance(owner, symbol);
  }

  /**
   * Get asset balances by owner
   * @param {string} owner
   * @return {Promise<Object>}
   */
  async getAccountBalancesByOwner(owner) {
    return this.fungibleTokenHttp.getAccountBalancesByOwner(owner);
  }

  /**
   * Get certain assets balances for all accounts
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountsBalancesBySymbol(symbol) {
    return this.fungibleTokenHttp.getAccountsBalancesBySymbol(symbol);
  }

  /** @type {() => FungibleTokenService} */
  static getInstance = makeSingletonInstance(() => new FungibleTokenService());
}

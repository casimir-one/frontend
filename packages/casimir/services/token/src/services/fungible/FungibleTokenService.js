import { genRipemd160Hash, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import {
  TransferFungibleTokenCmd,
  CreateFungibleTokenCmd,
  IssueFungibleTokenCmd
} from '@deip/commands';
import { APP_PROPOSAL } from '@deip/constants';
import { ChainService } from '@deip/chain-service';
import { FungibleTokenHttp } from './FungibleTokenHttp';
import { transferToken, updateProposalInfo } from '../../util';

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

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const entityId = genRipemd160Hash(symbol);
            const createFungibleTokenCmd = new CreateFungibleTokenCmd({
              entityId,
              issuer,
              symbol,
              precision,
              maxSupply,
              minBalance,
              description,
              metadata
            });
            txBuilder.addCmd(createFungibleTokenCmd);
            const tokenId = createFungibleTokenCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const { account, token } = holders[i];
                const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
                  tokenId,
                  amount: token.amount,
                  issuer,
                  recipient: account
                });
                txBuilder.addCmd(issueFungibleTokenCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
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
            const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
              issuer,
              tokenId,
              amount,
              recipient
            });
            txBuilder.addCmd(issueFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
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

    const transferTokenCmd = new TransferFungibleTokenCmd({
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
  async getList(limit, lowerBoundSymbol) {
    return this.fungibleTokenHttp.getList(limit, lowerBoundSymbol);
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
  static getInstance = createInstanceGetter(FungibleTokenService);
}

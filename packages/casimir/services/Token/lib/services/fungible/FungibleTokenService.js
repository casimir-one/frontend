import { makeSingletonInstance } from '@casimir.one/toolbox';
import { proxydi } from '@casimir.one/proxydi';
import { JsonDataMsg } from '@casimir.one/messages';
import { TransferFTCmd, CreateFTClassCmd, IssueFTCmd } from '@casimir.one/commands';
import { APP_PROPOSAL } from '@casimir.one/platform-core';
import { ChainService } from '@casimir.one/chain-service';
import { walletSignTx } from '@casimir.one/platform-util';
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
   * @param {import('@casimir.one/platform-core').FungibleTokenCreatePayload} payload
   * @return {Promise<Object>}
   */
  async create(payload) {
    const {
      initiator: {
        privKey
      },
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
    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainRpc = chainService.getChainRpc();
    const txBuilder = await chainTxBuilder.begin();
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
        const {
          account,
          asset
        } = holders[i];
        const issueFTCmd = new IssueFTCmd({
          tokenId,
          amount: asset.amount,
          issuer,
          recipient: account
        });
        txBuilder.addCmd(issueFTCmd);
      }
    }

    const packedTx = await txBuilder.end();
    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.fungibleTokenHttp.create(msg);
  }

  /**
   * Issue fungible token
   * @param {import('@casimir.one/platform-core').FungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  async issue(payload) {
    const {
      initiator: {
        privKey
      },
      data: {
        issuer,
        tokenId,
        amount,
        recipient
      }
    } = payload;
    const env = this.proxydi.get('env');
    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();
    const txBuilder = await chainTxBuilder.begin();
    const issueFTCmd = new IssueFTCmd({
      issuer,
      tokenId,
      amount,
      recipient
    });
    txBuilder.addCmd(issueFTCmd);
    const packedTx = await txBuilder.end();
    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.fungibleTokenHttp.issue(msg);
  }

  /**
   * Transfer fungible token
   * @param {import('@casimir.one/platform-core').FungibleTokenTransferPayload} payload
   * @return {Promise<Object>}
   */
  async transfer(payload) {
    const transferPayload = updateProposalInfo(payload);
    const {
      data: {
        from,
        to,
        token
      }
    } = transferPayload;
    const transferTokenCmd = new TransferFTCmd({
      from,
      to,
      tokenId: token.id,
      amount: token.amount
    });
    return transferToken(transferPayload, transferTokenCmd, APP_PROPOSAL.FT_TRANSFER_PROPOSAL, this.fungibleTokenHttp.transfer);
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
  async getAccountDaoBalance(address, assetId) {
    const env = this.proxydi.get('env');
    const chainService = await ChainService.getInstanceAsync(env);
    const chainRpc = chainService.getChainRpc();
    return chainRpc.getFungibleTokenBalanceByOwnerAsync(address, assetId);
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
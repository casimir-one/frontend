import { Singleton } from '@deip/toolbox';
import { GrantsHttp } from './GrantsHttp';
import { ChainService } from '@deip/chain-service';
import { proxydi } from '@deip/proxydi';


// WARNING: GrantsService is obsolete and will be refactored according to 'CallsModel'
class GrantsService extends Singleton {
  grantsHttp = GrantsHttp.getInstance();
  proxydi = proxydi;


  createGrantContract(privKey, {
    foaNumber,
    grantor,
    amount,
    targetDisciplines,
    distributionModel,
    extensions
  }) {

    const create_grant_op = ['create_grant', {
      "external_id": foaNumber, // replace with entitiy id
      "grantor": grantor,
      "amount": amount,
      "target_disciplines": targetDisciplines,
      "distribution_model": distributionModel,
      "extensions": extensions
    }];

    return this.signOperations([create_grant_op], privKey)
      .then((signedTx) => {
        return this.sendTransactionAsync(signedTx)
      })
  }


  createFundingOpportunityAward(privKey, {
    awardNumber,
    fundingOpportunityNumber,
    award,
    awardee,
    researchExternalId,
    universityExternalId,
    universityOverhead,
    subawardees,
    creator,
    extensions
  }) {

    const create_award_op = ['create_award', {
      award_number: awardNumber,
      funding_opportunity_number: fundingOpportunityNumber,
      award: award,
      awardee: awardee,
      research_external_id: researchExternalId,
      university_external_id: universityExternalId,
      university_overhead: universityOverhead,
      subawardees: subawardees,
      creator: creator,
      extensions: extensions
    }];

    return this.signOperations([create_award_op], privKey)
      .then((signedTx) => {
        return this.sendTransactionAsync(signedTx)
      })
  }

  approveFundingOpportunityAward(privKey, {
    awardNumber,
    approver,
    extensions
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.approveAwardAsync(
          privKey,
          awardNumber,
          approver,
          extensions);
      });
  }

  rejectFundingOpportunityAward(privKey, {
    awardNumber,
    rejector,
    extensions
  }) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.rejectAwardAsync(
          privKey,
          awardNumber,
          rejector,
          extensions);
      });
  }

  createAwardWithdrawalRequest({ privKey, username }, form) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return this.grantsHttp.createGrantAwardWithdrawalRequest(form.get('researchExternalId'), form)
          .then((res) => {
            const { hash } = res;
            return deipRpc.broadcast.createAwardWithdrawalRequestAsync(
              privKey,
              form.get('paymentNumber'),
              form.get('awardNumber'),
              form.get('subawardNumber'),
              form.get('requester'),
              form.get('amount'),
              form.get('description'),
              hash,
              []
            );
          })
      });
  }


  authorizeAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    account,
    extensions
  }) {


    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();


        const certify_award_withdrawal_request_op = ["certify_award_withdrawal_request", {
          "payment_number": paymentNumber,
          "award_number": awardNumber,
          "subaward_number": subawardNumber,
          "certifier": account,
          "extensions": extensions || []
        }];

        const approve_award_withdrawal_request_op = ["approve_award_withdrawal_request", {
          "payment_number": paymentNumber,
          "award_number": awardNumber,
          "subaward_number": subawardNumber,
          "approver": account,
          "extensions": extensions || []
        }];

        const pay_award_withdrawal_request_op = ["pay_award_withdrawal_request", {
          "payment_number": paymentNumber,
          "award_number": awardNumber,
          "subaward_number": subawardNumber,
          "payer": account,
          "extensions": extensions || []
        }];

        return this.signOperations([
          certify_award_withdrawal_request_op,
          approve_award_withdrawal_request_op,
          pay_award_withdrawal_request_op
        ], privKey)
          .then((signedTx) => {
            return this.sendTransactionAsync(signedTx)
          })
      });
  }

  certifyAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    certifier,
    extensions
  }) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.certifyAwardWithdrawalRequestAsync(
          privKey,
          paymentNumber,
          awardNumber,
          subawardNumber,
          certifier,
          extensions);
      });
  }

  approveAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    approver,
    extensions
  }) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.approveAwardWithdrawalRequestAsync(
          privKey,
          paymentNumber,
          awardNumber,
          subawardNumber,
          approver,
          extensions);
      });
  }

  rejectAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    rejector,
    extensions
  }) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.rejectAwardWithdrawalRequestAsync(
          privKey,
          paymentNumber,
          awardNumber,
          subawardNumber,
          rejector,
          extensions);
      });
  }

  payAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    payer,
    extensions
  }) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.broadcast.payAwardWithdrawalRequestAsync(
          privKey,
          paymentNumber,
          awardNumber,
          subawardNumber,
          payer,
          extensions);
      });
  }

  getFundingOpportunityAnnouncement(id) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getFundingOpportunityAnnouncementAsync(id);
      });
  }

  getFundingOpportunityAnnouncementByNumber(foaNum) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getFundingOpportunityAnnouncementByNumberAsync(foaNum);
      });
  }

  getFundingOpportunityAnnouncementsByOrganization(researchGroupId) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getFundingOpportunityAnnouncementsByOrganizationAsync(researchGroupId);
      });
  }

  getFundingOpportunityAnnouncementsListing(page, limit) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getFundingOpportunityAnnouncementsListingAsync(page, limit);
      });
  }

  getAwardByNumber(awardNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardAsync(awardNumber);
      });
  }

  getAwardsByFundingOpportunity(foaNum) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardsByFundingOpportunityAsync(foaNum);
      });
  }

  getAwardRecipient(id) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardRecipientAsync(id);
      });
  }

  getAwardRecipientsByAward(awardId) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardRecipientsByAwardAsync(awardId);
      });
  }

  getAwardRecipientsByAccount(awardee) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardRecipientsByAccountAsync(awardee);
      });
  }

  getAwardRecipientsByFundingOpportunity(foaNum) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardRecipientsByFundingOpportunityAsync(foaNum);
      });
  }

  getAwardWithdrawalRequest(awardNumber, paymentNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return Promise.all([
          deipRpc.api.getAwardWithdrawalRequestAsync(awardNumber, paymentNumber),
          this.grantsHttp.getAwardWithdrawalRequestPackageRef(awardNumber, paymentNumber)
        ])
          .then(([onchain, offchain]) => {
            return {
              ...onchain,
              withdrawalRef: offchain
            }
          });
      });
  }

  getAwardWithdrawalRequestsByAward(awardNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardWithdrawalRequestsByAwardAsync(awardNumber);
      });
  }

  getAwardWithdrawalRequestsByAwardAndSubaward(awardNumber, subawardNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardWithdrawalRequestsByAwardAndSubawardAsync(awardNumber, subawardNumber);
      });
  }

  getAwardWithdrawalRequestsByAwardAndStatus(awardNumber, status) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getAwardWithdrawalRequestsByAwardAndStatusAsync(awardNumber, status);
      });
  }

  getWithdrawalRequestsHistoryByAwardNumber(awardNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getWithdrawalRequestsHistoryByAwardNumberAsync(awardNumber);
      });
  }

  getWithdrawalRequestHistoryByAwardAndPaymentNumber(awardNumber, paymentNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getWithdrawalRequestHistoryByAwardAndPaymentNumberAsync(awardNumber, paymentNumber);
      });
  }

  getWithdrawalRequestsHistoryByAwardAndSubawardNumber(awardNumber, subawardNumber) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getWithdrawalRequestsHistoryByAwardAndSubawardNumberAsync(awardNumber, subawardNumber);
      });
  }

  getGrantWithAnnouncedApplicationWindow(id) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getGrantWithAnnouncedApplicationWindowAsync(id);
      });
  }

  getGrantsWithAnnouncedApplicationWindowByGrantor(grantor) {

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getGrantsWithAnnouncedApplicationWindowByGrantorAsync(grantor);
      });
  }


  findAwardSubawardees(item, all) {


    let descendants = all.filter(d => d.source == item.awardee && d.award_number == item.award_number);
    for (let i = 0; i < descendants.length; i++) {
      let sub_descendants = this.findAwardSubawardees(descendants[i], all);
      let filtered = sub_descendants.filter(d => !descendants.some(sub_desc => sub_desc.award_number == d.award_number && sub_desc.subaward_number == d.subaward_number));
      descendants.push(...filtered);
    }
    return descendants;
  }

  findParentAwardees(item, all) {
    let ascendant = all.find(a => a.awardee == item.source && a.award_number == item.award_number);
    if (!ascendant) {
      return [];
    }
    let ascendants = [ascendant];
    if (ascendant.source) {
      ascendants.push(...this.findParentAwardees(ascendant, all));
    }
    return ascendants;
  }

  getRefBlockSummary() {
    let refBlockNum;
    let refBlockPrefix;

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return deipRpc.api.getDynamicGlobalPropertiesAsync()
          .then((res, err) => {
            if (err) throw new Error(err);
            refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
            return deipRpc.api.getBlockHeaderAsync(res.last_irreversible_block_num);
          })
          .then((res, err) => {
            if (err) throw new Error(err);
            refBlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
            return { refBlockNum, refBlockPrefix };
          })
      })
  }

  signOperations(operations, privKey, refBlock = {}) {

    const { refBlockNum, refBlockPrefix } = refBlock;
    const refBlockPromise = refBlockNum && refBlockPrefix
      ? Promise.resolve({ refBlockNum, refBlockPrefix })
      : this.getRefBlockSummary();

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const deipRpc = chainService.getChainNodeClient();

        return refBlockPromise
          .then(({ refBlockNum, refBlockPrefix }) => {
            const nowPlus1Hour = new Date().getTime() + 3e6;
            const expire = new Date(nowPlus1Hour).toISOString().split('.')[0];

            const tx = {
              expiration: expire,
              extensions: [],
              operations: operations,
              ref_block_num: refBlockNum,
              ref_block_prefix: refBlockPrefix
            };

            return Promise.resolve(tx);
          })
          .then((tx) => {
            const clientSignedTx = deipRpc.auth.signTransaction(tx, { owner: privKey });
            return clientSignedTx;
          });
      });
  }

  async sendTransactionAsync(tx) {
    const promise = new Promise((resolve, reject) => {

      const env = this.proxydi.get('env');
      return ChainService.getInstanceAsync(env)
        .then((chainService) => {
          const deipRpc = chainService.getChainNodeClient();

          deipRpc.api.broadcastTransactionSynchronous(tx, function (err, result) {
            if (err) {
              console.log(err);
              reject(err)
            } else {
              resolve(result)
            }
          });
        })
    });
    return promise;
  }


  async getBlock(blockNum) {
    return new Promise((resolve, reject) => {
      const env = this.proxydi.get('env');
      return ChainService.getInstanceAsync(env)
        .then((chainService) => {
          const deipRpc = chainService.getChainNodeClient();

          deipRpc.api.getBlock(blockNum, (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });

        });
    });
  }

  async getTransaction(trxId) {
    return new Promise((resolve, reject) => {
      const env = this.proxydi.get('env');
      return ChainService.getInstanceAsync(env)
        .then((chainService) => {
          const deipRpc = chainService.getChainNodeClient();

          deipRpc.api.getTransaction(trxId, (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
    });
  }

  async getTransactionHex(trx) {
    return new Promise((resolve, reject) => {
      const env = this.proxydi.get('env');
      return ChainService.getInstanceAsync(env)
        .then((chainService) => {
          const deipRpc = chainService.getChainNodeClient();

          deipRpc.api.getTransactionHex(trx, (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
    });
  }


  getAssetSymbol = (assets) => {
    return assets.split(' ')[1];
  }

  getAssetPrecision = (assets) => {
    return ((assets.split(' ')[0]).split('.')[1]).length;
  }

  fromAssetsToFloat = (assets) => {
    return parseFloat(assets.split(' ')[0]);
  }

  toAssetUnits = (amount, precision, symbol) => {
    let value = parseFloat(amount).toFixed(precision);
    return `${value} ${symbol}`;
  }

}

export {
  GrantsService
};

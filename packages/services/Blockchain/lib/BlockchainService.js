import deipRpc from '@deip/deip-oa-rpc-client';
import { Singleton } from '@deip/toolbox';

class BlockchainService extends Singleton {

  signOperation(operation, ownerKey) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getDynamicGlobalProperties(function (err, result) {
        if (!err) {
          const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
          deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function (e, res) {
            const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
            const now = new Date().getTime() + 3e6;
            const expire = new Date(now).toISOString().split('.')[0];

            const unsignedTX = {
              'expiration': expire,
              'extensions': [],
              'operations': [operation],
              'ref_block_num': BlockNum,
              'ref_block_prefix': BlockPrefix
            };

            try {
              const signedTX = deipRpc.auth.signTransaction(unsignedTX, {'owner': ownerKey});
              resolve(signedTX);
            } catch (err) {
              reject(err);
            }
          });
        }
      });
    })
  }

  async getTransaction(trxId) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getTransaction(trxId, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getTransactionHex(trx) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getTransactionHex(trx, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getBlock(blockNum) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getBlock(blockNum, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getBlockHeader(blockNum) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getBlockHeader(blockNum, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getDynamicGlobalProperties() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getDynamicGlobalProperties(function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getChainProperties() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getChainProperties(function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getWitnesses([ids]) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getWitnesses([ids], function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getWitnessByAccount(account) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getWitnessByAccount(account, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async getConfig() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getConfig(function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result);
      });
    })
  }

  async findBlocksByRange(startTime, endTime) {

    const props = await this.getDynamicGlobalProperties();

    let block, lastBlock, firstBlock;
    let upperBound, lowerBound, midpoint;
    let probe;

    lastBlock = props.head_block_number;

    upperBound = lastBlock;
    lowerBound = 1;
    midpoint = null;

    while (lowerBound + 1 < upperBound) {
      probe = Math.floor((upperBound + lowerBound) / 2);
      block = await this.getBlockHeader(probe);
      // console.log("block", probe, block['timestamp'])

      if (block['timestamp'] < startTime) {
        lowerBound = probe
      } else if (block['timestamp'] > endTime) {
        upperBound = probe
      } else {
        midpoint = probe;
        break;
      }
    }

    let tooLarge = midpoint;

    while (lowerBound + 1 < tooLarge) {
      probe = Math.floor((lowerBound + tooLarge) / 2);
      block = await this.getBlockHeader(probe)
      // console.log("block", probe, block['timestamp'])
      if (block['timestamp'] <= startTime) {
        lowerBound = probe
      } else {
        tooLarge = probe
      }
    }

    var tooSmall = midpoint;

    while (tooSmall + 1 < upperBound) {
      probe = Math.floor((tooSmall + upperBound) / 2);
      block = await this.getBlockHeader(probe)
      // console.log("block", probe, block['timestamp'])

      if (block['timestamp'] <= endTime) {
        tooSmall = probe
      } else {
        upperBound = probe
      }
    }

    firstBlock = await this.getBlockHeader(lowerBound)
    lastBlock = await this.getBlockHeader(upperBound - 1);

    // console.log("First block:", lowerBound, firstBlock['timestamp'])
    // console.log("Last block:", upperBound - 1, lastBlock['timestamp'])
    return {first: {num: lowerBound, block: firstBlock}, last: {num: upperBound - 1, block: lastBlock}};
  }

}

export {
  BlockchainService
};

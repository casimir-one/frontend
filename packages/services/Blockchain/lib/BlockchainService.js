import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';

class BlockchainService extends Singleton {

  getRefBlockSummary() {
    let refBlockNum;
    let refBlockPrefix;

    return deipRpc.api.getDynamicGlobalPropertiesAsync()
      .then((res, err) => {
        if (err) throw new Error(err);
        refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
        return deipRpc.api.getBlockHeaderAsync(res.last_irreversible_block_num);
      })
      .then((res, err) => {
        if (err) throw new Error(err);
        refBlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
        return { refBlockNum, refBlockPrefix};
      })
  }

  signOperations(operations, privKey, refBlock = {}) {

    const { refBlockNum, refBlockPrefix } = refBlock;
    const refBlockPromise = refBlockNum && refBlockPrefix 
      ? Promise.resolve({ refBlockNum, refBlockPrefix })
      : this.getRefBlockSummary();
    
    return refBlockPromise
      .then(({ refBlockNum, refBlockPrefix }) => {
        const nowPlus1Hour = new Date().getTime() + 3e6;
        const expire = new Date(nowPlus1Hour).toISOString().split('.')[0];

        const unsignedTX = {
          expiration: expire,
          extensions: [],
          operations: operations,
          ref_block_num: refBlockNum,
          ref_block_prefix: refBlockPrefix
        };

        const signedTX = deipRpc.auth.signTransaction(unsignedTX, { owner: privKey });
        return signedTX;
      });
  }

  async getTransaction(trxId) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getTransaction(trxId, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getTransactionHex(trx) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getTransactionHex(trx, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getBlock(blockNum) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getBlock(blockNum, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getBlockHeader(blockNum) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getBlockHeader(blockNum, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getDynamicGlobalProperties() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getDynamicGlobalProperties((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getChainProperties() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getChainProperties((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getWitnesses([ids]) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getWitnesses([ids], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getWitnessByAccount(account) {
    return new Promise((resolve, reject) => {
      deipRpc.api.getWitnessByAccount(account, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getConfig() {
    return new Promise((resolve, reject) => {
      deipRpc.api.getConfig((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async findBlocksByRange(startTime, endTime) {
    const props = await this.getDynamicGlobalProperties();

    let block;
    let lastBlock;
    let firstBlock;
    let upperBound;
    let lowerBound;
    let midpoint;
    let probe;

    lastBlock = props.head_block_number;

    upperBound = lastBlock;
    lowerBound = 1;
    midpoint = null;

    while (lowerBound + 1 < upperBound) {
      probe = Math.floor((upperBound + lowerBound) / 2);
      block = await this.getBlockHeader(probe);
      // console.log("block", probe, block['timestamp'])

      if (block.timestamp < startTime) {
        lowerBound = probe;
      } else if (block.timestamp > endTime) {
        upperBound = probe;
      } else {
        midpoint = probe;
        break;
      }
    }

    let tooLarge = midpoint;

    while (lowerBound + 1 < tooLarge) {
      probe = Math.floor((lowerBound + tooLarge) / 2);
      block = await this.getBlockHeader(probe);
      // console.log("block", probe, block['timestamp'])
      if (block.timestamp <= startTime) {
        lowerBound = probe;
      } else {
        tooLarge = probe;
      }
    }

    let tooSmall = midpoint;

    while (tooSmall + 1 < upperBound) {
      probe = Math.floor((tooSmall + upperBound) / 2);
      block = await this.getBlockHeader(probe);
      // console.log("block", probe, block['timestamp'])

      if (block.timestamp <= endTime) {
        tooSmall = probe;
      } else {
        upperBound = probe;
      }
    }

    firstBlock = await this.getBlockHeader(lowerBound);
    lastBlock = await this.getBlockHeader(upperBound - 1);

    // console.log("First block:", lowerBound, firstBlock['timestamp'])
    // console.log("Last block:", upperBound - 1, lastBlock['timestamp'])
    return { first: { num: lowerBound, block: firstBlock }, last: { num: upperBound - 1, block: lastBlock } };
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
  BlockchainService
};

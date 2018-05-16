require('babel-polyfill');
import assert from 'assert';
import should from 'should';
import testPost from './test-post.json';
import deipRpc from '../src';

describe('deip.api:', function() {
    this.timeout(30 * 1000);

    describe('setOptions', () => {
        it('works', () => {
            deipRpc.api.setOptions({ url: deipRpc.config.get('websocket') });
        });
    });

    describe('streamBlockNumber', () => {
        it('streams deip transactions', (done) => {
            let i = 0;
            const release = deipRpc.api.streamBlockNumber((err, block) => {
                should.exist(block);
                block.should.be.instanceOf(Number);
                i++;
                if (i === 2) {
                    release();
                    done();
                }
            });
        });
    });

    describe('streamBlock', () => {
        it('streams deip blocks', (done) => {
            let i = 0;
            const release = deipRpc.api.streamBlock((err, block) => {
                try {
                    should.exist(block);
                    block.should.have.properties([
                        'previous',
                        'transactions',
                        'timestamp',
                    ]);
                } catch (err2) {
                    release();
                    done(err2);
                    return;
                }

                i++;
                if (i === 2) {
                    release();
                    done();
                }
            });
        });
    });

    describe('streamTransactions', () => {
        it('streams deip transactions', (done) => {
            let i = 0;
            const release = deipRpc.api.streamTransactions((err, transaction) => {
                try {
                    should.exist(transaction);
                    transaction.should.have.properties([
                        'ref_block_num',
                        'operations',
                        'extensions',
                    ]);
                } catch (err2) {
                    release();
                    done(err2);
                    return;
                }

                i++;
                if (i === 2) {
                    release();
                    done();
                }
            });
        });
    });

    describe('streamOperations', () => {
        it('streams deip operations', (done) => {
            let i = 0;
            const release = deipRpc.api.streamOperations((err, operation) => {
                try {
                    should.exist(operation);
                } catch (err2) {
                    release();
                    done(err2);
                    return;
                }

                i++;
                if (i === 2) {
                    release();
                    done();
                }
            });
        });
    });

    describe('useApiOptions', () => {
        it('works ok with the prod instances', async() => {
            deipRpc.api.setOptions({ useAppbaseApi: true, url: deipRpc.config.get('uri') });

            const result = await deipRpc.api.getContentAsync('yamadapc', 'test-1-2-3-4-5-6-7-9');
            deipRpc.api.setOptions({ useAppbaseApi: false, url: deipRpc.config.get('uri') });

            result.should.have.properties(testPost);
        });
    });

});
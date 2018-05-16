import Promise from 'bluebird';
import should from 'should';
import deipRpc from '../src';

const username = process.env.DEIP_USERNAME || 'guest123';
const password = process.env.DEIP_PASSWORD;
const postingWif = password ?
    deipRpc.auth.toWif(username, password, 'posting') :
    '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

describe('deip.broadcast:', () => {
    it('exists', () => {
        should.exist(deipRpc.broadcast);
    });

    it('has generated methods', () => {
        should.exist(deipRpc.broadcast.vote);
        should.exist(deipRpc.broadcast.voteWith);
        should.exist(deipRpc.broadcast.comment);
        should.exist(deipRpc.broadcast.transfer);
    });

    it('has backing methods', () => {
        should.exist(deipRpc.broadcast.send);
    });

    it('has promise methods', () => {
        should.exist(deipRpc.broadcast.sendAsync);
        should.exist(deipRpc.broadcast.voteAsync);
        should.exist(deipRpc.broadcast.transferAsync);
    });

    describe('patching transaction with default global properties', () => {
        it('works', async() => {
            const tx = await deipRpc.broadcast._prepareTransaction({
                extensions: [],
                operations: [
                    ['vote', {
                        voter: 'yamadapc',
                        author: 'yamadapc',
                        permlink: 'test-1-2-3-4-5-6-7-9',
                    }]
                ],
            });

            tx.should.have.properties([
                'expiration',
                'ref_block_num',
                'ref_block_prefix',
                'extensions',
                'operations',
            ]);
        });
    });

    describe('writeOperations', () => {
        it('receives a properly formatted error response', () => {
            const wif = deipRpc.auth.toWif('username', 'password', 'posting');
            return deipRpc.broadcast.voteAsync(wif, 'voter', 'author', 'permlink', 0).
            then(() => {
                throw new Error('writeOperation should have failed but it didn\'t');
            }, (e) => {
                should.exist(e.message);
            });
        });
    });
});
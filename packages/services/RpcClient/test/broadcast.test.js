import Promise from 'bluebird';
import should from 'should';
import deip from '../src';

const username = process.env.DEIP_USERNAME || 'guest123';
const password = process.env.DEIP_PASSWORD;
const postingWif = password ?
    deip.auth.toWif(username, password, 'posting') :
    '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

describe('deip.broadcast:', () => {
    it('exists', () => {
        should.exist(deip.broadcast);
    });

    it('has generated methods', () => {
        should.exist(deip.broadcast.vote);
        should.exist(deip.broadcast.transfer);
    });

    it('has backing methods', () => {
        should.exist(deip.broadcast.send);
    });

    it('has promise methods', () => {
        should.exist(deip.broadcast.sendAsync);
        should.exist(deip.broadcast.voteAsync);
        should.exist(deip.broadcast.transferAsync);
    });

    describe('patching transaction with default global properties', () => {
        it('works', async() => {
            const tx = await deip.broadcast._prepareTransaction({
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
});
const deipRpc = require('../lib');

/* Generate private active WIF */
const username = process.env.DEIP_USERNAME;
const password = process.env.DEIP_PASSWORD;
const privActiveWif = deipRpc.auth.toWif(username, password, 'active');

/** Add posting key auth */
deipRpc.broadcast.addKeyAuth({
        signingKey: privActiveWif,
        username,
        authorizedKey: 'DEIP88CPfhCmeEzCnvC1Cjc3DNd1DTjkMcmihih8SSxmm4LBqRq5Y9',
        role: 'posting',
    },
    (err, result) => {
        console.log(err, result);
    }
);
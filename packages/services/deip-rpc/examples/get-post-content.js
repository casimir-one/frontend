const deipRpc = require('../lib');

const resultP = deipRpc.api.getContentAsync('yamadapc', 'test-1-2-3-4-5-6-7-9');
resultP.then(result => console.log(result));

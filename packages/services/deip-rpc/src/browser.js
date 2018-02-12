const api = require("./api");
const auth = require("./auth");
const broadcast = require("./broadcast");
const config = require("./config");
const formatter = require("./formatter")(api);
const utils = require("./utils");

const deipRpc = {
  api,
  auth,
  broadcast,
  config,
  formatter,
  utils
};

if (typeof window !== "undefined") {
  window.deipRpc = deipRpc;
}

if (typeof global !== "undefined") {
  global.deipRpc = deipRpc;
}

exports = module.exports = deipRpc;

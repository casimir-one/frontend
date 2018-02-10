const api = require("./api");
const auth = require("./auth");
const broadcast = require("./broadcast");
const config = require("./config");
const formatter = require("./formatter")(api);
const utils = require("./utils");

const deip = {
  api,
  auth,
  broadcast,
  config,
  formatter,
  utils
};

if (typeof window !== "undefined") {
  window.deip = deip;
}

if (typeof global !== "undefined") {
  global.deip = deip;
}

exports = module.exports = deip;

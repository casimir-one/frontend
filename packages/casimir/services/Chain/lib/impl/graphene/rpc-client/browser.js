"use strict";

var api = require("./api");
var auth = require("./auth");
var broadcast = require("./broadcast");
var config = require("./config");
var formatter = require("./formatter")(api);
var utils = require("./utils");

var deipRpc = {
    api: api,
    auth: auth,
    broadcast: broadcast,
    config: config,
    formatter: formatter,
    utils: utils
};

if (typeof window !== "undefined") {
    window.deipRpc = deipRpc;
}

if (typeof global !== "undefined") {
    global.deipRpc = deipRpc;
}

exports = module.exports = deipRpc;
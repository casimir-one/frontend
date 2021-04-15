class BaseRequest {

  constructor(appCmds = [], headers = {}) {
    this._appCmds = appCmds.map(cmd => cmd.serialize());
    this._headers = headers;
  }

  addCmd(cmd) { this._appCmds.push(cmd.serialize()); }
  addCmds(cmds) { this._appCmds.push(...cmds.map(cmd => cmd.serialize())); }

  getRequestHeaders() { return this._headers; }
  getRequestBody() { throw new Error("Not implemented exception!"); }

}


export default BaseRequest;
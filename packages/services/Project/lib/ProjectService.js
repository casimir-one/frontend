import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { APP_CMD } from './constants';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';

// TODO: Move models to a separate package

const assert = (condition, failureMessage = "Assertion failed") => {
  if (condition) return;
  throw new Error(failureMessage);
}


const APP_CMD_INFO = {}

const GRAPHENE_OPERATIONS_MAP = (api) => {
  return {

    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare,
      extensions
    }, txContext) => {

      const op = ['create_research', {
        external_id: entityId,
        research_group: teamId,
        description: description,
        disciplines: domains,
        is_private: isPrivate || false,
        members: members,
        review_share: reviewShare || undefined,
        compensation_share: compensationShare || undefined,
        extensions: extensions || []
      }];

      const [projectId, createResearchOp] = entityId 
        ? [entityId, op] 
        : api.operations.createEntityOperation(op, txContext);

      return createResearchOp;
    },

    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    }, txContext) => {

      const op = ['create_proposal', {
        external_id: entityId,
        creator: creator,
        proposed_ops: proposedCmds.map((cmd) => ({ op: cmd.getProtocolOp() })),
        expiration_time: expirationTime,
        review_period_seconds: reviewPeriodSeconds,
        extensions: extensions
      }];

      const [proposalId, createProposalOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createProposalOp;
    }
  }
}


const POLKADOT_OPERATIONS_MAP = (api) => {
  return {

    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare
    }, txContext) => {

      // TODO: Generate project id
      return api.tx.deip.createProject(
        teamId,
        description,
        domains,
        isPrivate,
        members,
        reviewShare,
        compensationShare
      );
    },


    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    }, txContext) => {

      // TODO: Generate project id
      return api.tx.deip.createProposal(
        entityId,
        creator,
        proposedCmds,
        expirationTime,
        reviewPeriodSeconds,
        extensions
      );
    }

  }
}


class BaseTx {
  constructor({ operations }) {
    this._operations = operations || [];
  }

  addOp(op) {
    if (this._isSealed)
      throw new Error("Transaction cannot be modified after it has been sealed");

    this._operations.push(op);
    return this;
  }

  seal() {
    if (!this._operations.length)
      throw new Error("Empty transaction cannot be sealed");

    this._isSealed = true;
    return this;
  }

  sign() { throw new Error("Not implemented exception!"); }
  serialize() { throw new Error("Not implemented exception!"); }
  deserialize() { throw new Error("Not implemented exception!"); }
}

class GrapheneTx extends BaseTx {
  constructor({
    operations,
    expiration,
    refBlockNum,
    refBlockPrefix,
    extensions,
    signatures,
    tenantSignature
  }) {

    super({ operations });

    this._impl = {
      operations: this._operations,
      ref_block_num: refBlockNum,
      ref_block_prefix: refBlockPrefix,
      expiration: expiration || new Date(new Date().getTime() + 3e6).toISOString().split('.')[0], // 1 hour
      extensions: extensions || [],
      signatures: signatures || [],
      tenant_signature: tenantSignature || undefined
    };

    if (this._impl.signatures.length)
      this._isSealed = true;
  }

  sign(privKey) {
    this._impl = deipRpc.auth.signTransaction(this._impl, { owner: privKey });
    return this;
  }

  serialize() {
    return GrapheneTx.Serialize(this);
  }

  deserialize(serialized) {
    return GrapheneTx.Deserialize(serialized);
  }

  static Serialize(tx) {
    if (!tx || !tx._impl) return null;
    return JSON.stringify(tx._impl);
  }

  static Deserialize(serialized) {
    const data = JSON.parse(serialized);
    return new GrapheneTx({
      operations: data.operations,
      refBlockNum: data.ref_block_num,
      refBlockPrefix: data.ref_block_prefix,
      expiration: data.expiration,
      extensions: data.extensions,
      signatures: data.signatures,
      tenantSignature: data.tenant_signature
    });
  }
  
}


class BaseTxBuilder {

  constructor(api) {
    this._api = api;
    this._tx = null;
    this._txCtx = {
      appCmds: []
    };
  }

  clear() {
    this._tx = null;
    this._txCtx = {
      appCmds: []
    };
  }

  addCmd(protocolCmd) {
    if (!this._tx) 
      throw new Error("Transaction is not initiated");

    if (!protocolCmd instanceof ProtocolCmd)
      throw new Error("Transaction can contain only protocol commands");

    this._tx.addOp(protocolCmd.getProtocolOp());
    this._txCtx.appCmds.push(protocolCmd);
  }

  getTxCtx() {
    if (!this._tx)
      throw new Error("Transaction is not initiated");

    return this._txCtx;
  }

  begin(options) { throw new Error("Not implemented exception!"); }
  end(options) { throw new Error("Not implemented exception!"); }

}


class GrapheneTxBuilder extends BaseTxBuilder {
  
  constructor(grapheneApi) { 
    super(grapheneApi);
    this._tx = null;
  }

  begin({ expiration } = {}) {
    this.clear();

    let refBlockNum;
    let refBlockPrefix;

    return this._api.api.getDynamicGlobalPropertiesAsync()
      .then((res) => {
        refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
        return this._api.api.getBlockHeaderAsync(res.last_irreversible_block_num);
      })
      .then((res) => {
        refBlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
        this._tx = new GrapheneTx({
          expiration,
          refBlockNum,
          refBlockPrefix
        });
      });
  }

  end() {
    const tx = this._tx.seal();
    return Promise.resolve({ tx, ctx: this.getTxCtx() });
  }

  getTxCtx() {
    const ctx = super.getTxCtx();
    return {
      ...ctx,
      refBlockNum: this._tx._impl.ref_block_num,
      refBlockPrefix: this._tx._impl.ref_block_prefix
    }
  }
}

class PolkadotTxBuilder extends BaseTxBuilder {
  constructor(polkadotApi) {
    super(polkadotApi);
  }
}

class ChainOperationsRegistry {
  constructor(map) {
    this.map = map;
  }

  get(cmdNum) { return this.map[cmdNum]; };
}


class GrapheneOperationsRegistry extends ChainOperationsRegistry {
  constructor(polkadotApi) {
    super(GRAPHENE_OPERATIONS_MAP(polkadotApi));
  }
}


class PolkadotOperationsRegistry extends ChainOperationsRegistry {
  constructor(grapheneApi) {
    super(POLKADOT_OPERATIONS_MAP(grapheneApi));
  }
}


const protocolOperationsRegistry = process.env.PROTOCOL == 'polkadot'
  ? new PolkadotOperationsRegistry()
  : new GrapheneOperationsRegistry(deipRpc);




class AppCmd {

  constructor(cmdNum, cmdPayload) {
    this._cmdNum = cmdNum;
    this._cmdPayload = cmdPayload;
  }

  getCmdNum() { return this._cmdNum; }
  getCmdPayload() { return this._cmdPayload; }

  serialize() { return AppCmd.Serialize(this); }
  deserialize(serialized) { return AppCmd.Deserialize(serialized); }

  static Serialize(cmd) {
    return JSON.stringify({ 
      CMD_NUM: cmd.getCmdNum(),
      CMD_PAYLOAD: cmd.getCmdPayload()
    });
  }

  static Deserialize(serialized) {
    const { CMD_NUM, CMD_PAYLOAD } = JSON.parse(serialized);
    return new AppCmd(CMD_NUM, CMD_PAYLOAD);
  }

}


class ProtocolCmd extends AppCmd {

  constructor(cmdNum, cmdPayload, txContext = {}) {
    super(cmdNum, cmdPayload);
    this._protocolOp = protocolOperationsRegistry.get(cmdNum)(cmdPayload, txContext);
  }

  getProtocolOp() {
    return this._protocolOp;
  }

  serialize() {
    return ProtocolCmd.Serialize(this);
  }

  deserialize(serialized) {
    return ProtocolCmd.Deserialize(serialized);
  }

  static Serialize(cmd) {
    return JSON.stringify({ 
      PROTOCOL_OP: true,
      CMD_NUM: cmd.getCmdNum(),
      CMD_PAYLOAD: cmd.getCmdPayload()
    });
  }

  static Deserialize(serialized) {
    const { CMD_NUM, CMD_PAYLOAD } = JSON.parse(serialized);
    const CmdClass = APP_CMD_INFO[CMD_NUM].class;
    return new CmdClass(CMD_PAYLOAD);
  }

}

class ProtocolEntityCmd extends ProtocolCmd {

  constructor(cmdNum, cmdPayload, txContext) {
    const { entityId } = cmdPayload;

    if (!entityId)
      assert(!!txContext, "Transaction context must be specified for generating new entity ID");

    super(cmdNum, cmdPayload, txContext);
    this._cmdPayload['entityId'] = this.getProtocolEntityId();
  }

  getProtocolEntityId() { throw new Error("Not implemented exception!"); } 
}


class CreateProposalCmd extends ProtocolEntityCmd {

  constructor(cmdPayload, txContext) {

    const { 
      // entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions 
    } = cmdPayload;


    assert(!!proposedCmds && proposedCmds.length, "Protocol proposal must contain at least 1 ProtocolCmd");

    for (let i = 0; i < proposedCmds.length; i++) {
      const protocolCmd = proposedCmds[i];
      if (!protocolCmd instanceof ProtocolCmd)
        throw new Error("Proposal can contain only protocol commands");
    }

    assert(!!creator, "Proposal creator is required");
    assert(!!expirationTime, "Proposal expiration time is required");

    super(APP_CMD.CREATE_PROPOSAL, cmdPayload, txContext);
  }

  getProposedCmds() {
    return this._cmdPayload.proposedCmds;
  }

  getProtocolEntityId() {
    const [opName, { external_id: proposalId }] = this.getProtocolOp();
    return proposalId;
  }

  serialize() {
    return CreateProposalCmd.Serialize(this);
  }

  deserialize(serialized) {
    return CreateProposalCmd.Deserialize(serialized);
  }

  static Serialize(proposalCmd) {
    return JSON.stringify({
      PROTOCOL_OP: true,
      PROTOCOL_PROPOSAL: true,
      CMD_NUM: proposalCmd.getCmdNum(),
      CMD_PAYLOAD: {
        ...proposalCmd.getCmdPayload(),
        proposedCmds: proposalCmd.getProposedCmds()
          .map((cmd) => {
            const OP_NUM = cmd.getCmdNum();
            return OP_NUM == APP_CMD.CREATE_PROPOSAL
              ? CreateProposalCmd.Serialize(cmd)
              : ProtocolCmd.Serialize(cmd)
          })
      }
    });
  }

  static Deserialize(serialized) {
    const { CMD_PAYLOAD } = JSON.parse(serialized);
    return new CreateProposalCmd({
      ...CMD_PAYLOAD,
      proposedCmds: CMD_PAYLOAD.proposedCmds.map((cmd) => {
        const { CMD_NUM: OP_NUM } = JSON.parse(cmd);
        return OP_NUM == APP_CMD.CREATE_PROPOSAL
          ? CreateProposalCmd.Deserialize(cmd)
          : ProtocolCmd.Deserialize(cmd)
      })
    });
  }

}

APP_CMD_INFO[APP_CMD.CREATE_PROPOSAL] = { class: CreateProposalCmd, isProtocolOp: true };



class CreateProjectCmd extends ProtocolEntityCmd {

  constructor(cmdPayload, txContext) {
    const {
      // onchain
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare,
      extensions,

      // offchain
      attributes
    } = cmdPayload;

    assert(!!teamId, "Team ID is required");
    assert(!!description, "Project description is required");
    assert(!!domains && domains.length, "Project domain is required" );

    // TODO: validate others

    super(APP_CMD.CREATE_PROJECT, cmdPayload, txContext);
  }


  getProtocolEntityId() {
    const [opName, { external_id: projectId }] = this.getProtocolOp();
    return projectId;
  }
  
}

APP_CMD_INFO[APP_CMD.CREATE_PROJECT] = { class: CreateProjectCmd, isProtocolOp: true };



class BaseRequest {
  constructor(appCmds, protocolTxs, headers) {
    this._appCmds = (appCmds || []).map(cmd => cmd.serialize());
    this._protocolTxs = (protocolTxs || []).map(tx => tx.serialize());
    this._headers = headers || {};
  }

  addCmd(cmd) { this._appCmds.push(cmd.serialize()); }
  addCmds(cmds) { this._appCmds.push(...cmds.map(cmd => cmd.serialize())); }

  addTx(tx) { this._protocolTxs.push(tx.serialize()); }
  addTxs(txs) { this._protocolTxs.push(...txs.map(tx => tx.serialize())); }

  getRequestHeaders() { return this._headers; }
  getRequestBody() { throw new Error("Not implemented exception!"); }

}


class MultipartFormDataRequest extends BaseRequest {

  constructor(formData, appCmds, protocolTxs, headers) {
    super(appCmds, protocolTxs, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getRequestBody() { 
    this._formData.set('appCmds', JSON.stringify(this._appCmds));
    this._formData.set('protocolTxs', JSON.stringify(this._protocolTxs));
    return this._formData;
  }

}

class ApplicationJsonRequest extends BaseRequest {

  constructor(jsonData, appCmds, protocolTxs, headers) {
    super(appCmds, protocolTxs, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = jsonData || {};
  }

  getRequestBody() {
    return {
      ...this._jsonData,
      appCmds: this._appCmds,
      protocolTxs: this._protocolTxs
    };
  }
  
}


class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;

  createProject(request) {
    return this.projectHttp.createProject(request);
  }
}



export {
  ProjectService,
  GrapheneTx,
  GrapheneTxBuilder,
  CreateProjectCmd,
  CreateProposalCmd,
  MultipartFormDataRequest,
  ApplicationJsonRequest
};
import { makeSingletonInstance } from '@casimir.one/toolbox';
import { JsonDataMsg } from '@casimir.one/messages';
import {
  CreateLayoutCmd, UpdateLayoutCmd, DeleteLayoutCmd, UpdateLayoutSettingsCmd
} from '@casimir.one/commands';
import { proxydi } from '@casimir.one/proxydi';
import { LayoutHttp } from './LayoutHttp';

/**
 * Layouts data transport
 */
export class LayoutService {
  layoutHttp = LayoutHttp.getInstance();
  proxydi = proxydi;

  /**
   * Get layout
   * @param {string} layoutId
   * @returns {Promise<Object>}
   */
  async getOne(layoutId) {
    return this.layoutHttp.getLayout(layoutId);
  }

  /**
   * Get layouts
   * @returns {Promise<Object>}
   */
  async getList() {
    return this.layoutHttp.getLayouts();
  }

  /**
   * Get layouts by scope
   * @param {string} scope
   * @returns {Promise<Object>}
   */
  async getListByScope(scope) {
    return this.layoutHttp.getLayoutsByScope(scope);
  }

  /**
   * Create layout
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.scope
   * @param {string} payload.type
   * @param {Array.<Object>} payload.value
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const createLayoutCmd = new CreateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [createLayoutCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.layoutHttp.createLayout(msg);
  }

  /**
   * Update layout
   * @param {Object} payload
   * @param {string} payload._id
   * @param {string} payload.name
   * @param {string} payload.scope
   * @param {string} payload.type
   * @param {Array.<Object>} payload.value
   * @returns {Promise<Object>}
   */
  async update(payload) {
    const updateLayoutCmd = new UpdateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.layoutHttp.updateLayout(msg);
  }

  /**
   * Delete layout
   * @param {string} layoutId
   * @returns {Promise<Object>}
   */
  async remove(layoutId) {
    const deleteLayoutCmd = new DeleteLayoutCmd({ layoutId });
    const msg = new JsonDataMsg({ appCmds: [deleteLayoutCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.layoutHttp.deleteLayout(msg);
  }

  /**
   * Get layouts settings
   * @returns {Promise<Object>}
   */
  async getSettings() {
    return this.layoutHttp.getSettings();
  }

  /**
   * Update settings
   * @param {Object} data
   * @param {Array.<Object>} data.mappedKeys
   * @returns {Promise<Object>}
   */
  async updateSettings(data) {
    const updateLayoutSettingsCmd = new UpdateLayoutSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutSettingsCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.layoutHttp.updateSettings(msg);
  }

  /** @type {() => LayoutService} */
  static getInstance = makeSingletonInstance(() => new LayoutService());
}

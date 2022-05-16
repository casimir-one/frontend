import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update project content metadata command
 * @extends AppCmd
 */
class UpdateProjectContentMetadataCmd extends AppCmd {
  /**
   * Update command for project content metadata
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      _id,
      metadata
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    assert(!!metadata, "'metadata' is required");

    super(APP_CMD.UPDATE_PROJECT_CONTENT_METADATA, cmdPayload);
  }
}

export default UpdateProjectContentMetadataCmd;

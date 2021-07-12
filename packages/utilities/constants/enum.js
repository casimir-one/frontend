import { createEnum } from '@deip/toolbox';
import { ASSET_TYPE } from './lib/assets/module/enum';
import { ATTR_TYPES, ATTR_SCOPES } from './lib/attributes/service/enum';
// Modules
// // Assets
ASSET_TYPE = createEnum(ASSET_TYPE);
// Services
// // Attributes
ATTR_TYPES = createEnum(ATTR_TYPES);
ATTR_SCOPES = createEnum(ATTR_SCOPES);

export {
  ASSET_TYPE,
  ATTR_TYPES,
  ATTR_SCOPES
};

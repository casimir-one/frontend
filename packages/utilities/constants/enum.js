import { createEnum } from '@deip/toolbox';
import { ATTR_TYPES, ATTR_SCOPES } from './lib/attributes/service/enum';

// Services
// // Attributes
ATTR_TYPES = createEnum(ATTR_TYPES);
ATTR_SCOPES = createEnum(ATTR_SCOPES);

export {
  ATTR_TYPES,
  ATTR_SCOPES
};

import { createEnum } from '@deip/toolbox';

const ASSET_TYPE = createEnum({
  SYSTEM: 1,
  TOKEN: 2
});

const DEPOSIT_REQUEST_STATUS = createEnum({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3
});

export {
  ASSET_TYPE,
  DEPOSIT_REQUEST_STATUS
};

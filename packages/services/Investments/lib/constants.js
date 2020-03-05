import { createEnum } from '@deip/toolbox';

const TS_TYPES = createEnum({
  ACTIVE: 1,
  FINISHED: 2,
  EXPIRED: 3,
  INACTIVE: 4
});

export {
  TS_TYPES
};

import { createEnum } from '@deip/toolbox';

const USER_PROFILE_STATUS = createEnum({
  PENDING: 1,
  APPROVED: 2
});

export {
  USER_PROFILE_STATUS
};

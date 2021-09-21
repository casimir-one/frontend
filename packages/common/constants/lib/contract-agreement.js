import { createEnum } from '@deip/toolbox';

const CONTRACT_AGREEMENT_TYPE = createEnum({
  PROJECT_LICENSE: 1,
  INCOME_SHARE_AGREEMENT: 2
});

export {
  CONTRACT_AGREEMENT_TYPE
};

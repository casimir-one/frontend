import { createEnum } from '@deip/toolbox';

const PROJECT_APPLICATION_STATUS = createEnum({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELETED: 'deleted'
});

export {
  PROJECT_APPLICATION_STATUS
};

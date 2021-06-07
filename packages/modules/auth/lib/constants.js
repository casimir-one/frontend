import { createEnum } from '@deip/toolbox';

const SYSTEM_ROLE = createEnum({
  ADMIN: 'admin',
  ANY: '*'
});

export {
  SYSTEM_ROLE
};

import { wrapInArray } from '@deip/toolbox';
import { intersectionWith } from '@deip/toolbox/lodash';

export const hasRoles = (userRoles, roles) => {
  const rolesList = wrapInArray(roles);
  return intersectionWith((uR, rR) => uR.role === rR, userRoles, rolesList).length > 0;
};

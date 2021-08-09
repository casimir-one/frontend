import { wrapInArray } from '@deip/toolbox';
import { intersectionWith } from '@deip/toolbox/lodash';

export const hasRoles = (userRoles, roles) => {
  const rolesList = wrapInArray(roles);
  return intersectionWith(
    userRoles,
    rolesList,
    (uR, rR) => uR.role === rR
  ).length > 0;
};

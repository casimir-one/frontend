import { wrapInArray } from '@casimir/toolbox';
import { intersectionWith } from 'lodash';

export const hasRoles = (userRoles, roles) => {
  const rolesList = wrapInArray(roles);
  return intersectionWith(
    userRoles,
    rolesList,
    (uR, rR) => uR.role === rR
  ).length > 0;
};

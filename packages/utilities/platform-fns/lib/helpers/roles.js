import { intersectionWith } from 'lodash/fp';
import { wrapInArray } from '@deip/toolbox';

export const hasRoles = (userRoles, roles) => {
  const rolesList = wrapInArray(roles);
  return intersectionWith((uR, rR) => uR.role === rR, userRoles, rolesList).length > 0;
};

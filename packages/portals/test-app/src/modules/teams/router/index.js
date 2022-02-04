import { SYSTEM_ROLE } from '@deip/auth-module';
import { routeNameGenerator, routerView } from '@deip/platform-util';

import { VIEW_MODE } from '@deip/constants';
import { TeamList } from '@/modules/teams/components/TeamList';
import { TeamDetails } from '@/modules/teams/components/TeamDetails';
import { TeamForm } from '@/modules/teams/components/TeamForm';

const formViewMeta = (redirectTo, roles = [SYSTEM_ROLE.TEAM_ADMIN, SYSTEM_ROLE.ADMIN]) => ({
  auth: roles,
  redirectTo,
  viewSetup: {
    appBar: { type: 'back' },
    sideBar: { disabled: true }
  }
});

const components = {
  list: TeamList,
  details: TeamDetails,
  create: TeamForm,
  edit: TeamForm
};

const routeName = routeNameGenerator('teams').get;

export const teamsRouter = [
  {
    path: '/teams',
    component: routerView,
    meta: { auth: [SYSTEM_ROLE.ANY] },
    children: [
      {
        name: routeName(),
        path: '',
        component: components.list,
        meta: { auth: false }
      },
      {
        name: routeName('create'),
        path: 'create',
        component: components.create,
        meta: formViewMeta(routeName(), [SYSTEM_ROLE.ANY])
      },
      {
        path: ':teamId',
        name: routeName('details'),
        component: components.details,
        props: (route) => ({
          teamId: route.params.teamId
        }),
        meta: { auth: false }
      },
      {
        name: routeName('edit'),
        path: ':teamId/edit',
        component: components.edit,
        props: (route) => ({
          teamId: route.params.teamId,
          mode: VIEW_MODE.EDIT
        }),
        meta: formViewMeta(routeName('details'))
      }
    ]
  }
];

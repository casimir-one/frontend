import { SYSTEM_ROLE } from '@deip/auth-module';
import { routerView } from '@deip/platform-util';
import { VIEW_MODE } from '@deip/constants';

import { ProjectList } from '@/modules/projects/components/ProjectList';
import { ProjectForm } from '@/modules/projects/components/ProjectForm';
import { ProjectDetails } from '@/modules/projects/components/ProjectDetails';
import { ProjectNftCreate } from '@/modules/projects/components/ProjectNftCreate';
import { ProjectCrowdfundingCreate } from '@/modules/projects/components/ProjectCrowdfundingCreate';
import { ProjectCrowdfundingInvest } from '@/modules/projects/components/ProjectCrowdfundingInvest';

const formViewMeta = (redirectTo, roles = [SYSTEM_ROLE.TEAM_ADMIN, SYSTEM_ROLE.ADMIN]) => ({
  auth: roles,
  redirectTo,
  viewSetup: {
    appBar: { type: 'back' },
    sideBar: { disabled: true }
  }
});

export const projectsRouter = [
  {
    path: '/projects',
    component: routerView,
    meta: { auth: [SYSTEM_ROLE.ANY] },
    children: [
      {
        name: 'projects',
        path: '',
        component: ProjectList,
        meta: { auth: false }
      },
      {
        name: 'projects.create',
        path: 'create',
        component: ProjectForm,
        meta: formViewMeta('projects'),
        props: (route) => ({
          teamId: route.query.teamId,
          mode: VIEW_MODE.CREATE
        })
      },
      {
        name: 'projects.details',
        path: ':projectId',
        component: ProjectDetails,
        meta: { auth: [SYSTEM_ROLE.ANY] },
        props: (route) => ({
          projectId: route.params.projectId
        })
      },
      {
        name: 'projects.edit',
        path: ':projectId/edit',
        component: ProjectForm,
        meta: formViewMeta('projects.details'),
        props: (route) => ({
          projectId: route.params.projectId,
          mode: VIEW_MODE.EDIT
        })
      },
      {
        name: 'projects.nft.create',
        path: ':projectId/nft/create',
        component: ProjectNftCreate,
        meta: formViewMeta('projects.details'),
        props: (route) => ({
          projectId: route.params.projectId
        })
      },
      {
        name: 'projects.crowdfunding.create',
        path: ':projectId/crowdfunding/create',
        component: ProjectCrowdfundingCreate,
        meta: formViewMeta('projects.details'),
        props: (route) => ({
          projectId: route.params.projectId
        })
      },
      {
        name: 'projects.crowdfunding.invest',
        path: ':projectId/crowdfunding/invest',
        component: ProjectCrowdfundingInvest,
        meta: formViewMeta('projects.details', [SYSTEM_ROLE.ANY]),
        props: (route) => ({
          projectId: route.params.projectId
        })
      }
    ]
  }
];

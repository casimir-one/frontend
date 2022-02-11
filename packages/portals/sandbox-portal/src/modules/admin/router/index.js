import { SYSTEM_ROLE } from '@deip/auth-module';
import { VIEW_MODE } from '@deip/constants';

import { AdminTeams } from '@/modules/admin/components/AdminTeams';
import { AdminUsers } from '@/modules/admin/components/AdminUsers';
import { AdminProjects } from '@/modules/admin/components/AdminProjects';

import { AdminAttributes } from '@/modules/admin/components/attributes/AdminAttributes';
import { AdminAttributesForm } from '@/modules/admin/components/attributes/AdminAttributesForm';
import { AdminAttributesSettings } from '@/modules/admin/components/attributes/AdminAttributesSettings';

import { AdminLayouts } from '@/modules/admin/components/layouts/AdminLayouts';
import { AdminLayoutsForm } from '@/modules/admin/components/layouts/AdminLayoutsForm';
import { AdminLayoutsSettings } from '@/modules/admin/components/layouts/AdminLayoutsSettings';

// import { schoolsRouterFactory } from '@/modules/schools/router';
import { routerView } from '@deip/platform-util';

const formViewMeta = (
  auth = [SYSTEM_ROLE.ANY]
) => ({
  auth,
  viewSetup: {
    appBar: { type: 'back' },
    sideBar: { disabled: true }
  }
});

const editorMeta = () => ({
  auth: [SYSTEM_ROLE.ANY],
  viewSetup: {
    appBar: { disabled: true },
    sideBar: { disabled: true }
  }
});

export const adminRouter = [
  {
    path: '/admin',
    name: 'admin',
    component: routerView,
    meta: {
      auth: [SYSTEM_ROLE.ADMIN],
      redirectTo: 'home'
    },
    redirect: { name: 'admin.users' },
    children: [
      {
        name: 'admin.teams',
        path: 'teams',
        component: AdminTeams,
        meta: { auth: [SYSTEM_ROLE.ANY] }
      },
      {
        name: 'admin.users',
        path: 'users',
        component: AdminUsers,
        meta: { auth: [SYSTEM_ROLE.ANY] }
      },
      {
        name: 'admin.projects',
        path: 'projects',
        component: AdminProjects,
        meta: { auth: [SYSTEM_ROLE.ANY] }
      },
      {
        path: 'attributes',
        component: { template: '<router-view />' },
        children: [
          {
            name: 'admin.attributes',
            path: '',
            component: AdminAttributes,
            meta: { auth: [SYSTEM_ROLE.ANY] }
          },
          {
            name: 'admin.attributes.settings',
            path: 'settings',
            component: AdminAttributesSettings,
            meta: formViewMeta()
          },
          {
            name: 'admin.attributes.create',
            path: 'create',
            component: AdminAttributesForm,
            meta: formViewMeta()
          },
          {
            name: 'admin.attributes.edit',
            path: ':attributeId/edit',
            component: AdminAttributesForm,
            meta: formViewMeta(),
            props: (route) => ({
              attributeId: route.params.attributeId,
              mode: VIEW_MODE.EDIT,
              title: 'Edit attribute'
            })
          }
        ]
      },
      {
        path: 'layouts',
        component: { template: '<router-view />' },
        children: [
          {
            name: 'admin.layouts',
            path: '',
            component: AdminLayouts,
            meta: { auth: [SYSTEM_ROLE.ANY] }
          },
          {
            name: 'admin.layouts.settings',
            path: 'settings',
            component: AdminLayoutsSettings,
            meta: formViewMeta()
          },
          {
            name: 'admin.layouts.create',
            path: 'create',
            component: AdminLayoutsForm,
            meta: editorMeta()
          },
          {
            name: 'admin.layouts.edit',
            path: ':layoutId/edit',
            component: AdminLayoutsForm,
            meta: editorMeta(),
            props: (route) => ({
              layoutId: route.params.layoutId,
              mode: VIEW_MODE.EDIT,
              title: 'Edit layout'
            })
          }
        ]
      }
    ]
  }
];

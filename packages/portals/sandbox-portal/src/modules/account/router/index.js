import { SYSTEM_ROLE } from '@deip/auth-module';

import { AccountPassword } from '@/modules/account/components/AccounPassword';
import { AccountSummary } from '@/modules/account/components/AccountSummary';
import Wallet from '@/modules/account/components/Wallet/Wallet';
import { routerView } from '@deip/platform-util';

export const accountRouter = [
  {
    path: '/account',
    component: routerView,
    meta: {
      auth: [SYSTEM_ROLE.ANY]
    },
    children: [
      {
        path: 'details',
        name: 'account.details',
        component: AccountSummary,
        meta: {
          auth: [SYSTEM_ROLE.ANY]
        }
      },
      {
        path: 'wallet',
        name: 'account.wallet',
        component: Wallet,
        meta: {
          auth: [SYSTEM_ROLE.ANY]
        }
      },
      {
        path: 'change-password',
        name: 'account.password',
        component: AccountPassword,
        meta: {
          auth: [SYSTEM_ROLE.ANY]
        }
      }

    ]
  }
];

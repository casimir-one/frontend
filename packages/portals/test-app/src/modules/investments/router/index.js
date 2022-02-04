import { SYSTEM_ROLE } from '@deip/auth-module';

import { InvestmentList } from '@/modules/investments/components/InvestmentList';

export const investmentsRouter = [
  {
    name: 'investments',
    path: '/investments',
    component: InvestmentList,
    meta: { auth: [SYSTEM_ROLE.ANY] }
  }
];

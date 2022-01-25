import { blocksGenerator } from '@deip/vue-layout-schema';
import FundraisingWidget from '../components/Widget/FundraisingWidget';

export const fundraisingBlocks = {
  title: 'Fundraising',
  blocks: [
    ...blocksGenerator([
      {
        component: FundraisingWidget,
        data: {
          props: {
            projectId: '{{fundraisingWidget.projectId}}',
            canUserStartFundraising: '{{canEdit}}',
            investLink: '{{fundraisingWidget.investLink}}',
            startFundraisingLink: '{{fundraisingWidget.startFundraisingLink}}'
          }
        },
        icon: 'mdi-cash',
        children: [],
        disabledProps: [
          'projectId',
          'investLink',
          'startFundraisingLink',
          'canUserStartFundraising'
        ],
        blockType: 'simple'
      }
    ])
  ]
};

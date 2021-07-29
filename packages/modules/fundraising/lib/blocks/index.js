import { blocksGenerator } from '@deip/schema-builder';
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
            contributeLink: '{{fundraisingWidget.contributeLink}}',
            startFundraisingLink: '{{fundraisingWidget.startFundraisingLink}}'
          }
        },
        icon: 'mdi-cash',
        children: [],
        disabledProps: [
          'projectId',
          'contributeLink',
          'startFundraisingLink',
          'canUserStartFundraising'
        ],
        blockType: 'simple'
      }
    ])
  ]
};

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
            projectId: '{{projectId}}',
            canUserStartFundraising: '{{canEdit}}',
            contributeLink: '{{contributeLink}}',
            startFundraisingLink: '{{startFundraisingLink}}'
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

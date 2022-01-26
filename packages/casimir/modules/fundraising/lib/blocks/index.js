import { blocksGenerator } from '@deip/vue-layout-schema';
import CrowdfundingWidget from '../components/crowdfunding/Widget/CrowdfundingWidget';

export const сrowdfundingBlocks = {
  title: 'Crowdfunding',
  blocks: [
    ...blocksGenerator([
      {
        component: CrowdfundingWidget,
        data: {
          props: {
            projectId: '{{сrowdfundingWidget.projectId}}',
            canUserStartCrowdfunding: '{{canEdit}}',
            investLink: '{{fundraisingWidget.investLink}}',
            startCrowdfundingLink: '{{сrowdfundingWidget.startCrowdfundingLink}}'
          }
        },
        icon: 'mdi-cash',
        children: [],
        disabledProps: [
          'projectId',
          'investLink',
          'startCrowdfundingLink',
          'canUserStartCrowdfunding'
        ],
        blockType: 'simple'
      }
    ])
  ]
};

import { blocksGenerator } from '@deip/vue-layout-schema';
import CrowdfundingWidget from '../components/crowdfunding/Widget/CrowdfundingWidget';

export const crowdfundingBlocks = {
  title: 'Crowdfunding',
  blocks: [
    ...blocksGenerator([
      {
        component: CrowdfundingWidget,
        data: {
          props: {
            projectId: '{{crowdfundingWidget.projectId}}',
            canUserStartCrowdfunding: '{{crowdfundingWidget.canUserStartCrowdfunding}}',
            investLink: '{{crowdfundingWidget.investLink}}',
            startCrowdfundingLink: '{{crowdfundingWidget.startCrowdfundingLink}}'
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
        blockType: 'simple',
        layoutType: 'details',
        scope: ['project', 'team']
      }
    ])
  ]
};

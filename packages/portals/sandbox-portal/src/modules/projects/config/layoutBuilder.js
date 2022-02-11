import { blocksGenerator } from '@deip/vue-layout-schema';

import { crowdfundingBlocks, CrowdfundingWidget } from '@deip/investment-opportunities-module';
import { ProjectNftWidget } from '@/modules/projects/components/ProjectNftWidget';

export const layoutBuilderElements = {
  blocks: [
    {
      title: 'Components',
      blocks: [
        ...crowdfundingBlocks.blocks,
        ...blocksGenerator([
          {
            component: ProjectNftWidget,
            data: {
              props: {
                nfts: '{{projectNftWidget.nfts}}',
                canUserIssueTokens: '{{projectNftWidget.canUserIssueTokens}}'
              }
            },
            icon: 'mdi-cash',
            blockType: 'simple',
            layoutType: 'details',
            scope: ['project'],
            disabledProps: [
              'nfts',
              'canUserIssueTokens'
            ]
          }
        ])
      ]
    }
  ],
  components: {
    ProjectNftWidget,
    CrowdfundingWidget
  }
};

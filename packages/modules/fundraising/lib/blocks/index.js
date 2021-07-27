import { blocksGenerator } from '@deip/schema-builder';
import { FundraisingWidget } from '../components/Widget/FundraisingWidget';

export const fundraisingBlocks = {
  title: 'Fundraising',
  blocks: [
    ...blocksGenerator([
      {
        ...FundraisingWidget.options, // TODO: remove options
        icon: 'mdi-cash',
        children: [],
        disabledProps: [
          'projectId',
          'contributeLink',
          'startFundraisingLink',
          'canUserStartFundraising'
        ]
      }
    ])
  ]
};

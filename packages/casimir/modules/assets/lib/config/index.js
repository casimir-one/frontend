import { AttributeScope } from '@casimir/platform-core';
import { AssetInput } from '../components/AssetInput';

export const assetAttributes = [
  {
    type: 'assetInput',
    valueType: ['object'],
    label: 'Asset input',
    icon: 'mdi-cash',
    components: { set: { component: AssetInput } },
    scopes: [AttributeScope.NFT_ITEM]
  }
];

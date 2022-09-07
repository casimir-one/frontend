import { AttributeScope } from '@casimir.one/platform-core';
import { AttributeAssetSet, AttributeAssetRead } from '../components/AttributeAsset';

export const assetAttributes = [
  {
    type: 'asset',
    valueType: ['object'],
    label: 'Asset',
    icon: 'mdi-cash',
    validateRule: 'required',
    components: {
      read: { component: AttributeAssetRead },
      set: { component: AttributeAssetSet }
    },
    scopes: [AttributeScope.NFT_ITEM]
  }
];

export const components = { AttributeAssetRead, AttributeAssetSet };

export const nftCollectionsScope = {
  type: 'nftCollection',
  label: 'NFT collection',
  mappedKeys: {
    attributes: [],
    layouts: [
      {
        key: 'details',
        label: 'NFT collection details',
        allowedTypes: ['details']
      },
      {
        key: 'form',
        label: 'NFT collection form',
        allowedTypes: ['form']
      }
    ]
  }
};

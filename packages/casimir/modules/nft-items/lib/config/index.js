export const nftItemScope = {
  type: 'nftItem',
  label: 'NFT item',
  mappedKeys: {
    attributes: [],
    layouts: [
      {
        key: 'details',
        label: 'NFT item details',
        allowedTypes: ['details']
      },
      {
        key: 'form',
        label: 'NFT item form',
        allowedTypes: ['form']
      },
      {
        key: 'card',
        label: 'NFT item card',
        allowedTypes: ['card', 'details']
      },
      {
        key: 'moderation',
        label: 'NFT item moderation card',
        allowedTypes: ['card', 'details']
      }
    ]
  }
};

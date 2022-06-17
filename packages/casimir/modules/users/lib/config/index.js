export const userScope = {
  type: 'user',
  label: 'User',
  mappedKeys: {
    attributes: [
      {
        key: 'avatar',
        label: 'User avatar/photo',
        allowedTypes: ['avatar', 'image']
      },
      {
        key: 'firstName',
        label: 'User first name',
        allowedTypes: ['text']
      },
      {
        key: 'lastName',
        label: 'User last name',
        allowedTypes: ['text']
      }
    ],
    layouts: [
      {
        key: 'details',
        label: 'User details',
        allowedTypes: ['details']
      },
      {
        key: 'form',
        label: 'User form',
        allowedTypes: ['form']
      }
    ]
  }
};

export const userAttributes = [
  {
    type: 'userSelector',
    valueType: ['string'],
    label: 'User selector',
    icon: 'mdi-account-circle-outline',
    canBeMultiple: true,
    scopes: ['team', 'nftCollection']
  }
];

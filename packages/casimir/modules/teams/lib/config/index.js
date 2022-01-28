export const teamScope = {
  type: 'team',
  label: 'Team',
  mappedKeys: {
    attributes: [
      {
        key: 'avatar',
        label: 'Team avatar/logo',
        allowedTypes: ['avatar', 'image']
      },
      {
        key: 'name',
        label: 'Team name/title',
        allowedTypes: ['text']
      },
      {
        key: 'members',
        label: 'Team members',
        allowedTypes: ['userSelector'],
        isMultiple: true
      }
    ],
    layouts: [
      {
        key: 'details',
        label: 'Team details',
        allowedTypes: ['details']
      },
      {
        key: 'form',
        label: 'Team form',
        allowedTypes: ['form']
      }
    ]
  }
};

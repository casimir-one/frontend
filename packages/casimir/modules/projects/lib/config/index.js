export const projectScope = {
  type: 'project',
  label: 'Project',
  mappedKeys: {
    attributes: [
      {
        key: 'teamId',
        label: 'Project team',
        allowedTypes: ['teamSelector']
      },
      {
        key: 'domains',
        label: 'Project domain',
        allowedTypes: ['domainSelector']
      },
      {

        key: 'members',
        label: 'Project members',
        allowedTypes: ['userSelector'],
        isMultiple: true
      },
      {
        key: 'isPrivate',
        label: 'Project can be private',
        allowedTypes: ['checkbox', 'switch']
      }
    ],
    layouts: [
      {
        key: 'details',
        label: 'Project details',
        allowedTypes: ['details']
      },
      {
        key: 'form',
        label: 'Project form',
        allowedTypes: ['form']
      }
    ]
  }
};

export const projectScope = {
  type: 'project',
  label: 'Project',
  mappedKeys: {
    attributes: [
      {
        key: 'teamId',
        label: 'Project team',
        allowedTypes: ['teamSelector'],
        mapToModel: true
      },
      {
        key: 'domains',
        label: 'Project domain',
        allowedTypes: ['domainSelector'],
        mapToModel: true
      },
      {

        key: 'members',
        label: 'Project members',
        allowedTypes: ['userSelector'],
        isMultiple: true,
        mapToModel: true
      },
      {
        key: 'isPrivate',
        label: 'Project can be private',
        allowedTypes: ['checkbox', 'switch'],
        mapToModel: true
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

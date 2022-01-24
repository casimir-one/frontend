import { createEnum } from '@deip/toolbox';

// const ATTR_MODES = ['read', 'set'] as const;
// type AttrModes = typeof ATTR_MODES[number];

const VIEW_MODE = createEnum({
  CREATE: 1,
  EDIT: 2,
  READ: 3
});

const VIEW_MODE_LABELS = createEnum({
  [VIEW_MODE.CREATE]: 'Create',
  [VIEW_MODE.EDIT]: 'Edit',
  [VIEW_MODE.READ]: 'Read'
});

export {
  VIEW_MODE,
  VIEW_MODE_LABELS
};

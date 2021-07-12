import { createEnum } from '@deip/toolbox';

const ATTR_TYPES = createEnum({
  TEXT: 1,
  TEXTAREA: 2,
  SELECT: 3,
  SWITCH: 4,
  CHECKBOX: 5,
  DATE: 6,
  DATE_TIME: 7,
  FILE: 8,
  IMAGE: 9,
  URL: 10,
  NUMBER: 11,
  VIDEO_URL: 12,
  USER: 13,
  AVATAR: 14,
  LOCATION: 15,

  STEPPER: 501,
  DISCIPLINE: 502,
  RESEARCH_GROUP: 503,
  EXPRESS_LICENSING: 504,
  NETWORK_CONTENT_ACCESS: 505,
  ROADMAP: 506,
  PARTNERS: 507,
  EDUCATION: 508,
  EMPLOYMENT: 509,

  CUSTOM: 1001,
  FEATURE: 1002
});

const ATTR_TYPES_LABELS = {
  [ATTR_TYPES.TEXT]: 'Text field',
  [ATTR_TYPES.TEXTAREA]: 'Textarea',

  [ATTR_TYPES.SELECT]: 'Dropdown select',

  [ATTR_TYPES.SWITCH]: 'Switch',
  [ATTR_TYPES.CHECKBOX]: 'Checkbox',

  [ATTR_TYPES.DATE]: 'Date picker',
  [ATTR_TYPES.DATE_TIME]: 'Date/Time picker',

  [ATTR_TYPES.FILE]: 'File input',
  [ATTR_TYPES.IMAGE]: 'Image',
  [ATTR_TYPES.URL]: 'Url',
  [ATTR_TYPES.NUMBER]: 'Number',

  [ATTR_TYPES.VIDEO_URL]: 'Video url',
  [ATTR_TYPES.USER]: 'User selector',
  [ATTR_TYPES.AVATAR]: 'Avatar/Photo image',
  [ATTR_TYPES.LOCATION]: 'Location',

  // temp section

  [ATTR_TYPES.STEPPER]: 'STEPPER',
  [ATTR_TYPES.DISCIPLINE]: 'DISCIPLINE',
  [ATTR_TYPES.RESEARCH_GROUP]: 'RESEARCH_GROUP',
  [ATTR_TYPES.EXPRESS_LICENSING]: 'EXPRESS_LICENSING',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: 'NETWORK_CONTENT_ACCESS',
  [ATTR_TYPES.ROADMAP]: 'ROADMAP',
  [ATTR_TYPES.PARTNERS]: 'PARTNERS',
  [ATTR_TYPES.EDUCATION]: 'EDUCATION',
  [ATTR_TYPES.EMPLOYMENT]: 'EMPLOYMENT',

  // - temp section

  [ATTR_TYPES.CUSTOM]: 'Custom attribute',
  [ATTR_TYPES.FEATURE]: 'Feature attribute'
};

const ATTR_TYPES_ICONS = {
  [ATTR_TYPES.TEXT]: 'mdi-form-textbox',
  [ATTR_TYPES.TEXTAREA]: 'mdi-form-textarea',

  [ATTR_TYPES.SELECT]: 'mdi-form-select',

  [ATTR_TYPES.SWITCH]: 'mdi-toggle-switch-outline',
  [ATTR_TYPES.CHECKBOX]: 'mdi-check-box-outline',

  [ATTR_TYPES.DATE]: 'mdi-calendar',
  [ATTR_TYPES.DATE_TIME]: 'mdi-clock-outline',

  [ATTR_TYPES.FILE]: 'mdi-file-outline',
  [ATTR_TYPES.IMAGE]: 'mdi-file-image-outline',
  [ATTR_TYPES.URL]: 'mdi-link-variant-plus',
  [ATTR_TYPES.NUMBER]: 'mdi-numeric',

  [ATTR_TYPES.VIDEO_URL]: 'mdi-video-outline',
  [ATTR_TYPES.USER]: 'mdi-account-outline',
  [ATTR_TYPES.AVATAR]: 'mdi-account-circle-outline',
  [ATTR_TYPES.LOCATION]: 'mdi-map-marker-outline',

  // temp section

  [ATTR_TYPES.STEPPER]: 'mdi-format-list-numbered',
  [ATTR_TYPES.DISCIPLINE]: 'mdi-flask-empty-outline',
  [ATTR_TYPES.RESEARCH_GROUP]: 'mdi-account-box-outline',
  [ATTR_TYPES.EXPRESS_LICENSING]: 'mdi-file-certificate-outline',
  [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: 'mdi-account-key-outline',
  [ATTR_TYPES.ROADMAP]: 'mdi-timeline-clock-outline',
  [ATTR_TYPES.PARTNERS]: 'mdi-account-tie-outline',

  [ATTR_TYPES.EDUCATION]: 'EDUCATION',
  [ATTR_TYPES.EMPLOYMENT]: 'EMPLOYMENT',

  // - temp section

  [ATTR_TYPES.CUSTOM]: 'mdi-cogs',
  [ATTR_TYPES.FEATURE]: 'mdi-star-circle-outline'
};

const ATTR_SCOPES = createEnum({
  PROJECT: 1,
  USER: 2,
  TEAM: 3
});

const ATTR_SCOPES_LABELS = {
  [ATTR_SCOPES.PROJECT]: 'Project',
  [ATTR_SCOPES.USER]: 'User',
  [ATTR_SCOPES.TEAM]: 'Team'
};

const ATTR_TYPES_SET_RULES = {
  [ATTR_TYPES.TEXT]: 'required',
  [ATTR_TYPES.TEXTAREA]: 'required'
};

const avatarMask = `
<svg
  viewBox="0 0 320 320"
  fill="rgba(0,0,0,.5)"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M160 0H0V160V320H160H320V160V0H160ZM160 0C248.366 0 320 71.6344 320 160C320 248.366 248.366 320 160 320C71.6344 320 0 248.366 0 160C0 71.6344 71.6344 0 160 0Z"
  >
</svg>
`;

const ATTR_TYPES_SET_SCHEMAS = {
  [ATTR_TYPES.TEXT]: {
    is: 'v-text-field',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: true
  },
  [ATTR_TYPES.TEXTAREA]: {
    is: 'v-textarea',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        rows: 3,
        autoGrow: true,
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: true
  },

  [ATTR_TYPES.IMAGE]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        aspectRatio: '{{attribute.props.VexImageInput.aspectRatio}}',
        initialImage: '@getAttributeFileSrc("{{attribute.info._id}}", "{{attribute.value}}")',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  },

  [ATTR_TYPES.AVATAR]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        aspectRatio: 1,
        mask: avatarMask,
        noFlip: true,
        noRotate: true,
        initialImage: '@getAttributeFileSrc("{{attribute.info._id}}", "{{attribute.value}}")',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  },

  [ATTR_TYPES.LOCATION]: {
    is: 'vex-places-autocomplete',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  }
};

export {
  ATTR_TYPES,
  ATTR_TYPES_LABELS,
  ATTR_TYPES_ICONS,
  ATTR_SCOPES,
  ATTR_SCOPES_LABELS,
  ATTR_TYPES_SET_RULES,
  ATTR_TYPES_SET_SCHEMAS
};

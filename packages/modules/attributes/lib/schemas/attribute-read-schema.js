import {
  ATTR_TYPES
} from '@deip/constants';

const ATTR_TYPES_READ_SCHEMAS = {
  fallback: {
    is: 'div',
    text: '{{attribute.value}}'
  },

  // [ATTR_TYPES.TEXT]: {},
  //
  // [ATTR_TYPES.TEXT]: {},
  [ATTR_TYPES.TEXTAREA]: {
    is: 'VexMarkdown',
    data: {
      props: {
        source: '{{attribute.value}}'
      }
    }
  },
  // [ATTR_TYPES.SELECT]: {},
  // [ATTR_TYPES.SWITCH]: {},
  // [ATTR_TYPES.CHECKBOX]: {},
  // [ATTR_TYPES.DATE]: {},
  // [ATTR_TYPES.DATE_TIME]: {},
  // [ATTR_TYPES.FILE]: {},
  // [ATTR_TYPES.IMAGE]: {},
  // [ATTR_TYPES.URL]: {},
  // [ATTR_TYPES.NUMBER]: {},
  // [ATTR_TYPES.VIDEO_URL]: {},
  // [ATTR_TYPES.USER]: {},
  [ATTR_TYPES.AVATAR]: {
    is: 'VexAvatar',
    data: {
      props: {
        src: '{{(attribute.info._id)::getAttributeFileSrc}}',
        size: '{{proxyProps.VexAvatar.size}}'
      }
    }
  }
  // [ATTR_TYPES.LOCATION]: {},
  //
  // [ATTR_TYPES.STEPPER]: {},
  // [ATTR_TYPES.DISCIPLINE]: {},
  // [ATTR_TYPES.RESEARCH_GROUP]: {},
  // [ATTR_TYPES.EXPRESS_LICENSING]: {},
  // [ATTR_TYPES.NETWORK_CONTENT_ACCESS]: {},
  // [ATTR_TYPES.ROADMAP]: {},
  // [ATTR_TYPES.PARTNERS]: {},
  // [ATTR_TYPES.EDUCATION]: {},
  // [ATTR_TYPES.EMPLOYMENT]: {},
  //
  // [ATTR_TYPES.CUSTOM]: {},
  // [ATTR_TYPES.FEATURE]: {}
};

export { ATTR_TYPES_READ_SCHEMAS };

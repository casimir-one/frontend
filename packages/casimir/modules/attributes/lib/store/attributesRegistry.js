import { listGetterFactory, oneGetterFactory, setOneMutationFactory } from '@deip/platform-store';

export const baseAttributes = [
  {
    type: 'text',
    label: 'Text field',
    icon: 'mdi-form-textbox',
    validateRule: 'required'
  },
  {
    type: 'textarea',
    valueType: ['string'],
    label: 'Textarea',
    icon: 'mdi-form-textarea',
    validateRule: 'required'
  },
  {
    type: 'richText',
    valueType: ['array'],
    label: 'Rich text',
    icon: 'mdi-file-document-edit-outline'
  },
  {
    type: 'select',
    valueType: ['string', 'array'],
    label: 'Drop-down select',
    icon: 'mdi-form-select',
    canBeMultiple: true,
    canHaveOptions: true
  },
  {
    type: 'switch',
    valueType: ['string', 'array'],
    label: 'Switch',
    icon: 'mdi-toggle-switch-outline',
    canBeMultiple: true,
    isMultipleOptions: true
  },
  {
    type: 'checkbox',
    valueType: ['string', 'array'],
    label: 'Checkbox',
    icon: 'mdi-check-box-outline',
    canBeMultiple: true,
    isMultipleOptions: true
  },
  {
    type: 'date',
    valueType: ['string'],
    label: 'Date',
    icon: 'mdi-calendar'
  },
  {
    type: 'dateTime',
    valueType: ['string'],
    label: 'Date + Time',
    icon: 'mdi-clock-outline'
  },
  {
    type: 'number',
    valueType: ['number'],
    label: 'Number',
    icon: 'mdi-numeric'
  },
  {
    type: 'file',
    valueType: ['string'],
    label: 'File',
    icon: 'mdi-file-outline'
  },
  {
    type: 'image',
    valueType: ['string'],
    label: 'Image',
    icon: 'mdi-file-image-outline',
    proxyProps: {
      VexImageInput: {
        aspectRatio: {
          type: Number,
          default: 16 / 9
        }
      }
    }
  },
  {
    type: 'url',
    valueType: ['object', 'array'],
    label: 'URL',
    icon: 'mdi-link-variant-plus',
    canBeMultiple: true
  },
  {
    type: 'videoUrl',
    valueType: ['string', 'array'],
    label: 'Video URL',
    icon: 'mdi-video-outline'
  },
  {
    type: 'avatar',
    valueType: ['string'],
    label: 'Avatar',
    icon: 'mdi-account-circle-outline',
    proxyProps: {
      VexAvatar: {
        size: {
          type: Number,
          default: 48
        },
        fallbackIcon: {
          type: String,
          default: 'mdi-account-circle-outline'
        }
      }
    }
  },
  {
    type: 'location',
    valueType: ['string'],
    label: 'Location',
    icon: 'mdi-map-marker-outline'
  },
  {
    type: 'custom',
    valueType: ['object', 'array'],
    label: 'Custom',
    icon: 'mdi-cogs',
    canBeMultiple: true,
    canHaveTemplate: true
  }
];

const STATE = {
  data: baseAttributes
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory({ selectorKey: 'type' })
};

const ACTIONS = {
  addAttribute({ commit }, payload) {
    commit('setAttribute', payload);
  }
};

const MUTATIONS = {
  setAttribute: setOneMutationFactory({ mergeKey: 'type' })
};

export const attributesRegistry = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};

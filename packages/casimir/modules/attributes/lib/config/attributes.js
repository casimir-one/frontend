import { AttributeTextRead, AttributeTextSet } from '../components/AttributeText';
import { AttributeTextareaRead, AttributeTextareaSet } from '../components/AttributeTextarea';
import { AttributeRichtextRead, AttributeRichtextSet } from '../components/AttributeRichtext';
import { AttributeSelectRead, AttributeSelectSet } from '../components/AttributeSelect';
import { AttributeSwitchRead, AttributeSwitchSet } from '../components/AttributeSwitch';
import { AttributeCheckboxRead, AttributeCheckboxSet } from '../components/AttributeCheckbox';
import { AttributeDateRead, AttributeDateSet } from '../components/AttributeDate';
import { AttributeDateTimeRead, AttributeDateTimeSet } from '../components/AttributeDateTime';
import { AttributeNumberRead, AttributeNumberSet } from '../components/AttributeNumber';
import { AttributeFileRead, AttributeFileSet } from '../components/AttributeFile';
import { AttributeImageRead, AttributeImageSet } from '../components/AttributeImage';
import { AttributeUrlRead, AttributeUrlSet } from '../components/AttributeUrl';
import { AttributeVideoUrlRead, AttributeVideoUrlSet } from '../components/AttributeVideoUrl';
import { AttributeAvatarRead, AttributeAvatarSet } from '../components/AttributeAvatar';
import { AttributeLocationRead, AttributeLocationSet } from '../components/AttributeLocation';
import { AttributeCustomRead, AttributeCustomSet } from '../components/AttributeCustom';

export const baseAttributes = [
  {
    type: 'text',
    valueType: ['string'],
    label: 'Text field',
    icon: 'mdi-form-textbox',
    validateRule: 'required',

    components: {
      read: {
        component: AttributeTextRead,
        proxyProps: {
          VeLineClamp: {
            lines: {
              type: Number
            }
          }
        }
      },
      set: {
        component: AttributeTextSet
      }
    }
  },
  {
    type: 'textarea',
    valueType: ['string'],
    label: 'Textarea',
    icon: 'mdi-form-textarea',
    validateRule: 'required',

    components: {
      read: { component: AttributeTextareaRead },
      set: { component: AttributeTextareaSet }
    }
  },
  {
    type: 'richText',
    valueType: ['array'],
    label: 'Rich text',
    icon: 'mdi-file-document-edit-outline',

    components: {
      read: { component: AttributeRichtextRead },
      set: { component: AttributeRichtextSet }
    }
  },
  {
    type: 'select',
    valueType: ['string', 'array'],
    label: 'Drop-down select',
    icon: 'mdi-form-select',
    canBeMultiple: true,
    canHaveOptions: true,

    components: {
      read: { component: AttributeSelectRead },
      set: { component: AttributeSelectSet }
    }
  },
  {
    type: 'switch',
    valueType: ['string', 'array'],
    label: 'Switch',
    icon: 'mdi-toggle-switch-outline',
    canBeMultiple: true,
    isMultipleOptions: true,

    components: {
      read: { component: AttributeSwitchRead },
      set: { component: AttributeSwitchSet }
    }
  },
  {
    type: 'checkbox',
    valueType: ['string', 'array'],
    label: 'Checkbox',
    icon: 'mdi-check-box-outline',
    canBeMultiple: true,
    isMultipleOptions: true,

    components: {
      read: { component: AttributeCheckboxRead },
      set: { component: AttributeCheckboxSet }
    }
  },
  {
    type: 'date',
    valueType: ['string'],
    label: 'Date',
    icon: 'mdi-calendar',

    components: {
      read: { component: AttributeDateRead },
      set: { component: AttributeDateSet }
    }
  },
  {
    type: 'dateTime',
    valueType: ['string'],
    label: 'Date + Time',
    icon: 'mdi-clock-outline',

    components: {
      read: { component: AttributeDateTimeRead },
      set: { component: AttributeDateTimeSet }
    }
  },
  {
    type: 'number',
    valueType: ['number'],
    label: 'Number',
    icon: 'mdi-numeric',

    components: {
      read: { component: AttributeNumberRead },
      set: { component: AttributeNumberSet }
    }
  },
  {
    type: 'file',
    valueType: ['string'],
    label: 'File',
    icon: 'mdi-file-outline',

    components: {
      read: { component: AttributeFileRead },
      set: { component: AttributeFileSet }
    }
  },
  {
    type: 'image',
    valueType: ['string'],
    label: 'Image',
    icon: 'mdi-file-image-outline',

    components: {
      read: { component: AttributeImageRead },
      set: {
        component: AttributeImageSet,
        proxyProps: {
          VexImageInput: {
            aspectRatio: {
              type: Number,
              default: 16 / 9
            },
            noFlip: {
              type: Boolean,
              default: false
            },
            noRotate: {
              type: Boolean,
              default: false
            },
            noResize: {
              type: Boolean,
              default: false
            },
            round: {
              type: Boolean,
              default: false
            },
            disableCrop: {
              type: Boolean,
              default: false
            },
            maxSize: {
              type: Number
            }
          }
        }
      }
    }
  },
  {
    type: 'url',
    valueType: ['object', 'array'],
    label: 'URL',
    icon: 'mdi-link-variant-plus',
    canBeMultiple: true,

    components: {
      read: { component: AttributeUrlRead },
      set: { component: AttributeUrlSet }
    }
  },
  {
    type: 'videoUrl',
    valueType: ['string', 'array'],
    label: 'Video URL',
    icon: 'mdi-video-outline',

    components: {
      read: { component: AttributeVideoUrlRead },
      set: { component: AttributeVideoUrlSet }
    }
  },
  {
    type: 'avatar',
    valueType: ['string'],
    label: 'Avatar',
    icon: 'mdi-account-circle-outline',

    components: {
      read: {
        component: AttributeAvatarRead,
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
      set: { component: AttributeAvatarSet }
    }
  },
  {
    type: 'location',
    valueType: ['string'],
    label: 'Location',
    icon: 'mdi-map-marker-outline',

    components: {
      read: { component: AttributeLocationRead },
      set: { component: AttributeLocationSet }
    }
  },
  {
    type: 'custom',
    valueType: ['object', 'array'],
    label: 'Custom',
    icon: 'mdi-cogs',
    canBeMultiple: true,
    canHaveTemplate: true,

    components: {
      read: { component: AttributeCustomRead },
      set: { component: AttributeCustomSet }
    }
  }
];

import { isEqual, merge } from 'lodash/fp';

import dotProp from 'dot-prop';
import draggable from 'vuedraggable';

import {
  VTextField,
  VTextarea,
  VSwitch,
  VCheckbox,
  VSelect,
  VBtn,

  VCol,
  VRow,
  VForm,

  VCard,
  VCardActions,

  VDivider,
  VIcon,
  VToolbar,
  VSpacer

// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VexStack } from '@deip/vuetify-extended';
import { wrapInArray } from '@deip/toolbox';
import {
  ATTR_TYPES, ATTR_TYPES_LABELS,
  ATTR_SCOPES, ATTR_SCOPES_LABELS
} from '@deip/constants';

const createSelectItems = (labels) => Object.keys(labels).map((key) => ({
  value: parseInt(key, 10),
  text: labels[key]
}));

export const defaultAttributeModel = () => ({
  scope: ATTR_SCOPES.PROJECT,
  type: ATTR_TYPES.TEXT,

  title: '',
  shortTitle: '',
  description: '',

  defaultValue: null,
  valueOptions: [],

  isEditable: true,
  isFilterable: false, // deprecated
  isHidden: false,
  isMultiple: false,
  isRequired: false,
  isSystem: false,

  schema: {},
  marker: null,

  tenantId: null,
  blockchainFieldMeta: null
});

function genInputData(
  modelPath,
  data = {},
  prop = 'value',
  event = 'input'
) {
  const baseData = {
    props: {
      [prop]: dotProp.get(this, modelPath),
      hideDetails: 'auto',
      outlined: true // applied for text fields
    },
    on: {
      [event]: (val) => {
        dotProp.set(this, modelPath, val);
      }
    }
  };
  return merge(baseData, data);
}

const AttributeEdit = {
  name: 'AttributeEdit',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    mode: {
      type: String,
      default: 'create',
      validator(value) {
        return ['create', 'edit'].includes(value);
      }
    },
    value: {
      type: Object,
      default: () => defaultAttributeModel()
    }
  },

  data() {
    return {
      attributeData: defaultAttributeModel(),

      settings: {
        optionsHasDescription: false
      },

      disabled: false,
      loading: false
    };
  },

  computed: {
    isEditMode() {
      return this.mode === 'edit';
    },

    canHasOptions() {
      return this.attributeData.type === ATTR_TYPES.SELECT
        || (
          [ATTR_TYPES.SWITCH, ATTR_TYPES.CHECKBOX].includes(this.attributeData.type)
          && this.attributeData.isMultiple
        );
    },

    canBeMultiple() {
      return [
        // with options

        ATTR_TYPES.SELECT,
        ATTR_TYPES.SWITCH,
        ATTR_TYPES.CHECKBOX,

        // without options

        ATTR_TYPES.FILE,
        ATTR_TYPES.IMAGE,
        ATTR_TYPES.URL,
        ATTR_TYPES.NUMBER,
        ATTR_TYPES.VIDEO_URL,
        ATTR_TYPES.USER,
        ATTR_TYPES.CUSTOM,
        ATTR_TYPES.FEATURE
      ].includes(this.attributeData.type);
    }
  },

  watch: {
    value: {
      handler(val) {
        if (val && !isEqual(this.value, this.attributeData)) this.attributeData = val;
      },
      immediate: true,
      deep: true
    },
    attributeData: {
      handler(val) {
        if (!isEqual(this.value, val)) {
          this.changeAttributeType();
          this.$emit('input', val);
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    changeAttributeType() {

    },

    // FIELDS ////////////////////////////

    genTextField(modelPath, data) {
      return this.$createElement(
        VTextField,
        genInputData.call(this, modelPath, data)
      );
    },
    genTextarea(modelPath, data) {
      return this.$createElement(
        VTextarea,
        genInputData.call(this, modelPath, data)
      );
    },
    genSwitch(modelPath, data) {
      return this.$createElement(
        VSwitch,
        genInputData.call(this, modelPath, { class: 'ma-0 pa-0', ...data }, 'inputValue', 'change'),
      );
    },
    genCheckbox(modelPath, data) {
      return this.$createElement(
        VCheckbox,
        genInputData.call(this, modelPath, { class: 'ma-0 pa-0', ...data }, 'inputValue', 'change'),
      );
    },
    genSelect(modelPath, data) {
      return this.$createElement(
        VSelect,
        genInputData.call(this, modelPath, data, 'value', 'change'),
      );
    },
    genCol(cols = 12, nodes = []) {
      return this.$createElement(VCol, { props: { cols } }, wrapInArray(nodes));
    },

    // BASE ////////////////////////////

    genAttrSetup() {
      return this.$createElement(VRow, [
        this.genCol(6, [this.genSelect(
          'attributeData.type',
          {
            props: {
              items: createSelectItems(ATTR_TYPES_LABELS),
              label: 'Attribute type'
            }
          }
        )]),
        this.genCol(6, [this.genSelect(
          'attributeData.scope',
          {
            props: {
              items: createSelectItems(ATTR_SCOPES_LABELS),
              label: 'Attribute scope'
            }
          }
        )])
      ]);
    },

    genAttrMeta() {
      return this.$createElement(VRow, [
        this.genCol(8, [
          this.genTextField('attributeData.title', { props: { label: 'Title' } })
        ]),
        this.genCol(4, [
          this.genTextField('attributeData.shortTitle', { props: { label: 'Short title' } })
        ]),
        this.genCol(12, [
          this.genTextarea('attributeData.description', { props: { label: 'Description' } })
        ])
      ]);
    },

    // PROPERTIES ////////////////////////////

    genAttrProps() {
      return this.$createElement(
        VRow,
        {
          class: 'mt-0'
        },
        [
          'isEditable',
          'isHidden',
          'isRequired'
        ].map((key) => this.genCol(
          4,
          [
            this.genCheckbox(`attributeData.${key}`, { props: { label: key } })
          ]
        ))
      );
    },

    // OPTIONS ////////////////////////////////////

    genOptionsHeader() {
      return this.$createElement(
        VToolbar,
        [
          this.$createElement('div', { class: 'text-subtitle-1' }, 'Options'),
          this.$createElement(VSpacer),
          this.genSwitch('settings.optionsHasDescription', 'Show description')
        ]
      );
    },

    genOptionDragHandler() {
      return this.$createElement(VCol, {
        props: { cols: 'auto' },
        class: 'px-4 py-7'
      }, [
        this.$createElement(VIcon, { class: 'handle' }, 'mdi-drag-vertical')
      ]);
    },

    genOptionFields(index) {
      const fields = [
        this.genTextField(`attributeData.valueOptions.${index}.title`, { props: { placeholder: 'Title' } })
      ];

      if (this.settings.optionsHasDescription) fields.push(this.genTextarea(`attributeData.valueOptions.${index}.description`, { props: { placeholder: 'Description' } }));

      return this.$createElement(VCol, {
        class: 'py-4'
      }, [this.$createElement(VexStack, fields)]);
    },

    genOptionCtrl(index) {
      return this.$createElement(VCol, {
        props: {
          cols: 'auto'
        },
        class: 'px-3 py-5'
      }, [
        this.$createElement(VBtn, {
          props: { icon: true, small: true },
          on: {
            click: () => {
              this.removeOption(index);
            }
          }
        }, [this.$createElement(VIcon, 'mdi-close')])
      ]);
    },

    genOptionsList() {
      const options = [];
      for (const [index] of this.attributeData.valueOptions.entries()) {
        options.push(
          this.$createElement('div', [
            this.$createElement(VRow, { props: { noGutters: true, align: 'start' } }, [
              this.genOptionDragHandler(),
              this.genOptionFields(index),
              this.genOptionCtrl(index)
            ]),
            this.$createElement(VDivider)
          ])
        );
      }

      return this.$createElement(
        draggable,
        {
          props: {
            list: this.attributeData.valueOptions
          },
          attrs: {
            handle: '.handle'
          }
        },
        options
      );
    },

    genOptionAdd() {
      const button = this.$createElement(VBtn, {
        props: {
          text: true,
          small: true,
          color: 'primary'
        },
        on: {
          click: () => {
            this.addOption();
          }
        }
      }, 'Add item');

      return this.$createElement(VCardActions, { class: 'pa-3' }, [button]);
    },

    addOption() {
      this.attributeData.valueOptions.push({ title: '' });
    },

    removeOption(index) {
      this.attributeData.valueOptions.splice(index, 1);
    },

    genOptions() {
      return this.$createElement(
        VCard,
        {
          props: {
            outlined: true
          }
        },
        [
          this.genOptionsHeader(),
          this.$createElement(VDivider),
          this.genOptionsList(),
          this.genOptionAdd()
        ]
      );
    },

    // COSTOM TEMPLATE ////////////////////////////////////

    genComposer() {

    },

    // /////////////

    genSubmit() {
      return this.$createElement('div', { class: 'd-flex' }, [
        this.$createElement(VSpacer),
        this.$createElement(VBtn, {
          props: {
            color: 'primary',
            disabled: this.disabled,
            loading: this.loading
          },
          on: {
            click: () => {
              if (this.isEditMode) {
                this.update();
              } else {
                this.create();
              }
            }
          }
        }, this.isEditMode ? 'Update' : 'Create')
      ]);
    },

    // /////////////

    setLoading(state) {
      this.disabled = state;
      this.loading = state;
    },

    update() {
      this.setLoading(true);

      this.$store.dispatch('attributes/update', this.attributeData)
        .then(() => {
          this.$emit('success', true);
          this.setLoading(false);
        })
        .catch((err) => {
          this.$emit('error', err);
          this.setLoading(false);
        });
    },

    create() {
      this.setLoading(true);

      this.$store.dispatch('attributes/create', this.attributeData)
        .then(() => {
          this.$emit('success', true);
          this.setLoading(false);
        })
        .catch((err) => {
          this.$emit('error', err);
          this.setLoading(false);
        });
    }
  },

  render(h) {
    const children = [
      // this.$createElement('pre', JSON.stringify(this.attributeData, null, 2))
    ];

    if (this.mode !== 'edit') {
      children.push(
        this.genAttrSetup(),
        this.$createElement(VDivider)
      );
    }

    children.push(this.genAttrMeta());

    if (this.canBeMultiple) {
      children.push(this.genCheckbox('attributeData.isMultiple', { props: { label: 'Multiple chooses' } }));
    }

    if (this.canHasOptions) {
      children.push(this.genOptions());
    }

    children.push(this.$createElement(VDivider));
    children.push(this.genAttrProps());

    return h(VForm, {
      props: {
        disabled: this.disabled
      }
    }, [
      h(VexStack, { props: { gutter: 32 } }, [
        ...children,
        h(VDivider),
        this.genSubmit()
      ])
    ]);
  }
};

export default AttributeEdit;
export { AttributeEdit };

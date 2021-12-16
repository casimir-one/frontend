import { isEqual, merge, cloneDeep } from '@deip/toolbox/lodash';

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
  VSheet,

  VCard,

  VDivider,
  VIcon,
  VToolbar,
  VSpacer,
  VDialog

// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VeRawDisplay } from '@deip/vue-elements';

import {
  VlsBuilder,
  blocksGenerator
} from '@deip/vue-layout-schema';

import {
  isObject,
  RecursiveIterator
} from '@deip/toolbox';

import { VexStack } from '@deip/vuetify-extended';

import {
  ATTR_TYPES, ATTR_TYPES_LABELS,
  ATTR_SCOPES, ATTR_SCOPES_LABELS,
  VIEW_MODE
} from '@deip/constants';

const layoutBlocks = {
  title: 'Layout',
  blocks: blocksGenerator([
    {
      component: VRow,
      icon: 'mdi-view-grid-outline',
      children: [],
      blockType: 'row'
    },
    {
      component: VCol,
      icon: 'mdi-view-grid-plus-outline',
      children: []
    }
  ])
};

const formBlocks = {
  title: 'Form',
  blocks: blocksGenerator([
    {
      component: VTextField,
      icon: 'mdi-form-textbox',
      blockType: 'component',
      includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix'],
      model: 'VTextField'
    },
    {
      component: VTextarea,
      icon: 'mdi-form-textarea',
      blockType: 'component',
      includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix'],
      model: 'VTextarea'
    },
    {
      component: VSwitch,
      icon: 'mdi-toggle-switch-off-outline',
      blockType: 'component',
      includeProps: ['hint', 'label'],
      model: 'VSwitch'
    },
    {
      component: VCheckbox,
      icon: 'mdi-checkbox-marked-outline',
      blockType: 'component',
      includeProps: ['hint', 'label'],
      model: 'VSwitch'
    },
    {
      component: VSelect,
      icon: 'mdi-form-dropdown',
      blockType: 'component',
      includeProps: ['hint', 'label', 'placeholder', 'prefix', 'suffix', 'items'],
      model: 'VSelect'
    }
  ])
};

const genReflectedFormBlocks = (schema) => {
  const clone = cloneDeep(schema);
  const result = {
    title: 'Attribute data',
    blocks: []
  };

  for (const { node } of new RecursiveIterator(clone, 1, true)) {
    if (isObject(node) && !!node.model) {
      const { model, id, data: { props: { label } } } = node;
      const { icon } = formBlocks.blocks.find((b) => b.id === id);

      result.blocks.push({
        is: 'div',
        text: `{{attribute.value.${model}}}`,
        icon,
        name: label,
        blockType: 'component'
      });
    }
  }
  return result;
};

/**
 * Generate items for VSelect
 * @param labels
 * @returns {{text: *, value: number}[]}
 */
const createSelectItems = (labels) => Object.keys(labels).map((key) => ({
  value: parseInt(key),
  text: labels[key]
}));

export const defaultAttributeModel = () => ({
  scope: ATTR_SCOPES.PROJECT,
  // type: ATTR_TYPES.TEXT,
  type: ATTR_TYPES.CUSTOM,

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

  schemas: {},
  marker: null,

  tenantId: null,
  blockchainFieldMeta: null
});

/**
 * Generate data object for inputs
 * @param modelPath
 * @param data
 * @param prop
 * @param event
 * @returns {*}
 */
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
      type: Number,
      default: VIEW_MODE.CREATE,
      validator(value) {
        return [VIEW_MODE.CREATE, VIEW_MODE.EDIT].includes(value);
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

      dialogs: {
        composerSet: false,
        composerRead: false
      },

      disabled: false,
      loading: false
    };
  },

  computed: {
    isEditMode() {
      return this.mode === VIEW_MODE.EDIT;
    },
    isCreateMode() {
      return this.mode === VIEW_MODE.CREATE;
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
    },

    canHasTemplate() {
      return [
        ATTR_TYPES.CUSTOM
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
          this.$emit('input', val);
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {

    // FIELDS ////////////////////////////

    /**
     * Generate text input
     * @param modelPath
     * @param data
     * @returns {JSX.Element}
     */
    genTextField(modelPath, data) {
      const cmpData = genInputData.call(this, modelPath, data);
      return <VTextField {...cmpData} />;
    },

    /**
     * Generate textarea
     * @param modelPath
     * @param data
     * @returns {JSX.Element}
     */
    genTextarea(modelPath, data) {
      const cmpData = genInputData.call(this, modelPath, data);
      return <VTextarea {...cmpData} />;
    },

    /**
     * Generate switch toggle
     * @param modelPath
     * @param data
     * @returns {JSX.Element}
     */
    genSwitch(modelPath, data) {
      const cmpData = genInputData.call(this, modelPath, { class: 'ma-0 pa-0', ...data }, 'inputValue', 'change');
      return <VSwitch {...cmpData} />;
    },

    /**
     * Generate checkbox toggle
     * @param modelPath
     * @param data
     * @returns {JSX.Element}
     */
    genCheckbox(modelPath, data) {
      const cmpData = genInputData.call(this, modelPath, { class: 'ma-0 pa-0', ...data }, 'inputValue', 'change');
      return <VCheckbox {...cmpData} />;
    },

    /**
     * Generate dropdown select
     * @param modelPath
     * @param data
     * @returns {JSX.Element}
     */
    genSelect(modelPath, data) {
      const cmpData = genInputData.call(this, modelPath, data, 'value', 'change');
      return <VSelect {...cmpData} />;
    },

    // SPECIAL ////////////////////////////////////

    /**
     * Generate block for options setup
     * @returns {JSX.Element}
     */
    genOptions() {
      const optionsHeader = (
        <VToolbar>
          <div class="text-subtitle-1">Options</div>
          <VSpacer/>
          {this.genSwitch('settings.optionsHasDescription', { props: { label: 'Show description' } })}
        </VToolbar>
      );

      const optionsList = this.attributeData.valueOptions
        .map((_, index) => {
          const titleField = this.genTextField(
            `attributeData.valueOptions.${index}.title`,
            { props: { placeholder: 'Title' } }
          );
          const descriptionField = this.genTextarea(
            `attributeData.valueOptions.${index}.description`,
            { props: { placeholder: 'Description' } }
          );
          const delBtnData = {
            props: { icon: true, small: true },
            on: {
              click: () => {
                this.attributeData.valueOptions.splice(index, 1);
              }
            }
          };

          return (
            <div>
              <VRow noGutters align="start">
                <VCol cols="auto" class="px-4 py-7">
                  <VIcon class="handle">mdi-drag-vertical</VIcon>
                </VCol>
                <VCol class="py-4">
                  <VexStack>
                    {titleField}
                    {this.settings.optionsHasDescription ? descriptionField : ''}
                  </VexStack>
                </VCol>
                <VCol cols="auto" class="px-3 py-5">
                  <VBtn {...delBtnData}>
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VCol>
              </VRow>
              <VDivider/>
            </div>
          );
        });

      const addOptionBtn = (
        <VBtn
          text
          small
          color="primary"
          onClick={() => this.attributeData.valueOptions.push({ title: '', description: '' })}
        >
          Add item
        </VBtn>
      );

      return (
        <VCard outlined>
          {optionsHeader}
          <VDivider/>
          <draggable
            list={this.attributeData.valueOptions}
            handle=".handle"
          >
            {optionsList}
          </draggable>
          {addOptionBtn}
        </VCard>
      );
    },

    /**
     * Generate template schema builders
     * @returns {JSX.Element}
     */
    genComposer() {
      const builderSubmitHandler = (
        schema,
        target,
        cb = () => {}
      ) => {
        const clone = cloneDeep(schema);

        for (const { node } of new RecursiveIterator(clone, 1, true)) {
          if (isObject(node) && !!node.model) {
            node.model = node.uid;
          }
        }

        this.$set(this.attributeData.schemas, target, clone);
        cb();
      };

      const setBuilderSubmitHandler = (schema) => {
        builderSubmitHandler(schema, 'set', () => { this.dialogs.composerSet = false; });
      };

      const readBuilderSubmitHandler = (schema) => {
        builderSubmitHandler(schema, 'read', () => { this.dialogs.composerRead = false; });
      };

      const {
        set: composerSetSchema = [],
        read: composerReadSchema = []
      } = this.attributeData.schemas;

      const composerSetBlocks = [layoutBlocks, formBlocks];
      const composerReadBlocks = [layoutBlocks, genReflectedFormBlocks(composerSetSchema)];

      return (
        <div>
          <VBtn onClick={() => { this.dialogs.composerSet = true; }}>Edit SET schema</VBtn>
          <VBtn onClick={() => { this.dialogs.composerRead = true; }}>Edit READ schema</VBtn>

          <VDialog
            width="80vw"
            scrollable
            value={this.dialogs.composerSet}
          >
            <VSheet height="80vh" class="d-flex" color="white">
              <VlsBuilder
                class="spacer"
                value={composerSetSchema}
                blocks={composerSetBlocks}
                onSubmit={setBuilderSubmitHandler}
              />
            </VSheet>
          </VDialog>

          <VDialog
            width="80vw"
            scrollable
            value={this.dialogs.composerRead}
          >
            <VSheet height="80vh" class="d-flex" color="white">
              <VlsBuilder
                class="spacer"
                value={composerReadSchema}
                blocks={composerReadBlocks}
                onSubmit={readBuilderSubmitHandler}
              />
            </VSheet>
          </VDialog>

        </div>
      );
    },

    // /////////////

    /**
     * Set component loading state
     * @param state
     */
    setLoading(state) {
      this.disabled = state;
      this.loading = state;
    },

    /**
     * Update attribute data
     */
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

    /**
     * Create new attribute
     */
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
    },

    onSubmit() {
      if (this.isEditMode) {
        this.update();
      } else {
        this.create();
      }
    }
  },

  render() {
    const typeField = this.genSelect(
      'attributeData.type',
      {
        props: {
          items: createSelectItems(ATTR_TYPES_LABELS),
          label: 'Attribute type'
        }
      }
    );
    const scopeField = this.genSelect(
      'attributeData.scope',
      {
        props: {
          items: createSelectItems(ATTR_SCOPES_LABELS),
          label: 'Attribute scope'
        }
      }
    );
    const titleField = this.genTextField('attributeData.title', { props: { label: 'Title' } });
    const shortTitleField = this.genTextField('attributeData.shortTitle', { props: { label: 'Short title' } });
    const descriptionField = this.genTextarea('attributeData.description', { props: { label: 'Description' } });

    // /////////////

    const attrCreateHeader = [
      (
        <VRow>
          <VCol cols={6}>{typeField}</VCol>
          <VCol cols={6}>{scopeField}</VCol>
        </VRow>
      ),
      <VDivider/>
    ];

    const attrProps = [
      ...(this.canBeMultiple ? [{ key: 'isMultiple', label: 'isMultiple' }] : []),
      { key: 'isEditable', label: 'isEditable' },
      { key: 'isHidden', label: 'isHidden' },
      { key: 'isRequired', label: 'isRequired' }
    ].map((prop) => (
      <VCol cols={4}>
        {this.genCheckbox(`attributeData.${prop.key}`, { props: { label: prop.label } })}
      </VCol>
    ));

    // /////////////

    return (
      <VForm disabled={this.disabled}>
        <VexStack gutter={32}>

          {this.isCreateMode ? attrCreateHeader : null}

          <VRow>
            <VCol cols={8}>{titleField}</VCol>
            <VCol cols={4}>{shortTitleField}</VCol>
            <VCol cols={12}>{descriptionField}</VCol>
          </VRow>

          {this.canHasOptions ? this.genOptions() : null}
          {this.canHasTemplate ? this.genComposer() : null}

          <VRow>
            {attrProps}
          </VRow>

          {
            process.env.NODE_ENV === 'development'
              ? <VeRawDisplay value={this.attributeData} />
              : null
          }

          <div class="d-flex">
            <VSpacer/>
            <VBtn
              color="primary"
              loading={this.loading}
              disabled={this.disabled}
              onClick={this.onSubmit}
            >
              {this.isEditMode ? 'Update' : 'Create'}
            </VBtn>
          </div>
        </VexStack>
      </VForm>
    );
  }
};

export default AttributeEdit;
export { AttributeEdit };

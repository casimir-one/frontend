import {
  isArray,
  kindOf,
  objectPath,
  capitalCase, deepFindParentByValue, hasOwnProperty, sentenceCase
} from '@casimir/toolbox';

import { cloneDeep } from 'lodash';

import { VeStack } from '@casimir/vue-elements';

/* eslint-disable */
import {
  VTextField,
  VTextarea,
  VCheckbox,
  VSelect,
  VAutocomplete,
  VIcon,
  VSpacer
} from 'vuetify/lib/components';

import iconsData from '@mdi/svg/meta.json';
/* eslint-enable */

import { convertBlockPropsForCanvas } from '../../utils/helpers';
import { BuilderMixin } from '../../mixins';

const PERM_DISABLED = ['proxyProps'];

/**
 * @typedef {Object} Block
 * @property {string} blockType
 * @property {Object} [data]
 * @property {Array.<string>} [disabledProps]
 * @property {string} icon
 * @property {string} id
 * @property {string} is
 * @property {string} [layoutType]
 * @property {string} name
 * @property {Array.<string>} [scope]
 * @property {string} [text]
 */

/**
 * Builder node settings
 */
export default {
  name: 'VlsBuilderSettings',

  mixins: [BuilderMixin],

  computed: {
    /**
     * Node path
     * @returns {Array.<string>}
     */
    nodePath() {
      return deepFindParentByValue(this.schemaAcc, this.containerActiveNode, true).path;
    },

    /**
     * Node info
     * @returns {Block}
     */
    nodeInfo() {
      const { id } = objectPath.get(this.schemaAcc, this.nodePath);
      return this.getContainerNodeInfo(id);
    }
  },

  methods: {
    /**
     * Check block property type
     * @param {string} key
     * @param {string} path path to prop in node
     * @returns {string}
     */
    checkPropType(key, path) {
      const type = objectPath.get(this.nodeInfo, [...path, key, 'type']);
      if (!type) return kindOf(String());

      if (isArray(type)) {
        const acc = type.map((t) => kindOf(t()));
        if (acc.includes('number')) return kindOf(Number());
        if (acc.includes('boolean')) return kindOf(Boolean());
        return acc[0];
      }

      return kindOf(type());
    },

    /**
     * Update block property value in layout schema
     * @param {string[]} path
     * @param {*} value
     */
    setFieldVal(path, value) {
      const updated = cloneDeep(this.schemaAcc);
      if (value === '') {
        objectPath.set(updated, path, undefined);
      } else {
        objectPath.set(updated, path, value);
      }

      this.setContainerSchema(updated);
    },

    /**
     * Update block property value in layout schema
     * @param {string[]} path
     * @param {*} value
     */
    setFieldArrayVal(path, value) {
      const arr = value.split('\n').filter((i) => !!i);
      const updated = cloneDeep(this.schemaAcc);
      objectPath.set(updated, path, arr);

      this.setContainerSchema(updated);
    },

    /**
     * Generate VInput component props
     * @param {string} label
     * @returns {{hideDetails: boolean, label: string, dense: boolean}}
     */
    genFieldProps(label) {
      return {
        hideDetails: true,
        label: capitalCase(label),
        dense: true
      };
    },

    /**
     * Generate text input
     * @param {string[]} path
     * @param {string} label
     * @param {string} value
     * @returns {JSX.Element}
     */
    genTextField(path, label, value) {
      const initVal = objectPath.get(this.schemaAcc, path, value) || '';
      const props = this.genFieldProps(label);

      return (
        <VTextField
          {...{ props }}
          class="ma-0"
          value={!initVal ? '' : initVal}
          onInput={(v) => this.setFieldVal(path, v)}
        />
      );
    },

    /**
     * Generate text input
     * @param {string[]} path
     * @param {string} label
     * @param {string} value
     * @param {boolean} asArray
     * @returns {JSX.Element}
     */
    genTextarea(path, label, value, asArray = false) {
      const initVal = objectPath.get(this.schemaAcc, path, value) || '';
      const props = this.genFieldProps(label);

      const onInputHandler = (val) => {
        if (asArray) {
          this.setFieldArrayVal(path, val);
        } else {
          this.setFieldVal(path, val);
        }
      };

      return (
        <VTextarea
          {...{ props }}
          class="ma-0"
          value={asArray ? initVal.join('\n') : initVal}
          onInput={onInputHandler}
        />
      );
    },

    /**
     * Generate checkbox input
     * @param {string[]} path
     * @param {string} label
     * @param {boolean} value
     * @returns {JSX.Element}
     */
    genCheckbox(path, label, value) {
      const initVal = objectPath.get(this.schemaAcc, path, value);
      const props = this.genFieldProps(label);

      return (
        <VCheckbox
          {...{ props }}
          class="ma-0 pa-0"
          value={initVal}
          onChange={(v) => this.setFieldVal(path, v)}
        />
      );
    },

    /**
     * Generate select input
     * @param {string[]} path
     * @param {string} label
     * @param {string} value
     * @param {Array} items
     * @returns {JSX.Element}
     */
    genSelect(path, label, value, items) {
      const initVal = objectPath.get(this.schemaAcc, path, value);
      const props = this.genFieldProps(label);

      return (
        <VSelect
          {...{ props }}
          class="ma-0 pa-0"
          items={items}
          value={initVal}
          onChange={(v) => this.setFieldVal(path, v)}
        />
      );
    },

    /**
     * Generate icons selector
     * @param {string[]} path
     * @param {string} label
     * @param {string} value
     * @returns {JSX.Element}
     */
    genIconSelector(path, label, value) {
      if (this.$vuetify.icons.iconfont !== 'mdi') {
        return this.genTextField(path, label, value);
      }

      const initVal = objectPath.get(this.schemaAcc, path, value);
      const props = this.genFieldProps(label);

      const scopedSlots = {
        item: ({ item }) => (
          <div class="d-flex">
            <VIcon class="mr-4">mdi-{item.name}</VIcon>
            <VSpacer>{sentenceCase(item.name)}</VSpacer>
          </div>
        )
      };

      const getIconName = (icon) => sentenceCase(icon.name);
      const getIconValue = (icon) => `mdi-${icon.name}`;

      return (
        <VAutocomplete
          {...{ props, scopedSlots }}
          class="ma-0 pa-0"
          items={iconsData}
          item-text={getIconName}
          item-value={getIconValue}
          value={initVal}
          onChange={(v) => this.setFieldVal(path, v)}
        />
      );
    },

    /**
     * Generate property input based on property type
     * @param {string[]} fullPath path to prop in schema
     * @param {string[]} nodePath path to prop in node
     * @param {string} key
     * @param {*} defaultValue
     * @returns {JSX.Element|null}
     */
    genField(fullPath, nodePath, key, defaultValue) {
      const propType = this.checkPropType(key, nodePath);
      const propPath = [...fullPath, key];

      const params = [propPath, key, defaultValue];

      const disabled = ([
        ...PERM_DISABLED,
        ...(this.nodeInfo.disabledProps || [])
      ]).includes(key);

      if (disabled) return null;

      const allowedValues = this.nodeInfo?.propsValues?.[key];

      if (allowedValues && isArray(allowedValues)) {
        return this.genSelect(...params, allowedValues);
      }

      if (propType === 'boolean') {
        return this.genCheckbox(...params);
      }

      if (propType === 'array') {
        return this.genTextarea(...params);
      }

      if (key.toLowerCase().includes('icon')) {
        return this.genIconSelector(...params);
      }

      return this.genTextField(...params);
    },

    /**
     * Map properties from block to schema object
     * @param {Object} obj
     * @param {string[]} fullPath path to prop in schema
     * @param {string[]} nodePath path to prop in node
     * @returns {(JSX.Element|null)[]}
     */
    mapPropsFields(obj, fullPath, nodePath) {
      return Object.keys(obj)
        .filter((prop) => prop !== 'tag')
        .map((prop) => this.genField(fullPath, nodePath, prop, obj[prop]))
        .filter((f) => f);
    },

    /**
     * Generate inputs list for block properties
     * @returns {JSX.Element[]}
     */
    genFields() {
      const info = convertBlockPropsForCanvas(this.nodeInfo);
      const mainProps = objectPath.get(info, ['data', 'props'], {});
      const proxyProps = objectPath.get(info, ['data', 'proxyProps'], {});

      const mainPropsFields = () => this
        .mapPropsFields(
          mainProps,
          [...this.nodePath, 'data', 'props'],
          ['data', 'props']
        );

      const proxyPropsFields = () => Object.keys(proxyProps)
        .map((component) => this
          .mapPropsFields(
            proxyProps[component],
            [...this.nodePath, 'data', 'proxyProps', component],
            ['data', 'proxyProps', component]
          ));

      const additionalFields = () => [
        this.genTextField(
          [...this.nodePath, 'data', 'staticClass'],
          'Additional class'
        ),
        this.genTextField(
          [...this.nodePath, 'condition'],
          'Display conditions'
        )
      ];

      const allowText = hasOwnProperty('text', this.nodeInfo);
      const textInput = () => this.genTextarea(
        [...this.nodePath, 'text'],
        'Text'
      );

      return (
        <VeStack>
          {allowText ? [textInput()] : null}
          {mainPropsFields()}
          {proxyPropsFields()}
          {additionalFields()}
        </VeStack>
      );
    }
  },

  render() {
    const placeholder = () => (
      <div class="text-caption text--secondary">
        Select an element on the canvas to activate this panel.
      </div>
    );

    return (
      <div class="vls-builder-settings">
        {this.containerActiveNode ? this.genFields() : placeholder()}
      </div>
    );
  }
};

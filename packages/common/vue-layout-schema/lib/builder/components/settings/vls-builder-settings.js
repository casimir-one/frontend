import {
  isArray,
  kindOf,
  objectPath,
  capitalCase, deepFindParentByValue, hasOwnProperty, sentenceCase
} from '@deip/toolbox';

import { cloneDeep } from '@deip/toolbox/lodash';

import { VeStack } from '@deip/vue-elements';

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

export const VlsBuilderSettings = {
  name: 'VlsBuilderSettings',

  mixins: [BuilderMixin],

  computed: {
    nodePath() {
      return deepFindParentByValue(this.schemaAcc, this.containerActiveNode, true).path;
    },

    nodeInfo() {
      const { id } = objectPath.get(this.schemaAcc, this.nodePath);
      return this.getContainerNodeInfo(id);
    }
  },

  methods: {
    /**
     * Check block property type
     * @param {string} key
     * @returns {string}
     */
    checkPropType(key) {
      const type = this.nodeInfo?.data?.props?.[key]?.type;

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
      objectPath.set(updated, path, value);

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
     * @param {string[]} path
     * @param {string} key
     * @param {*} defaultValue
     * @returns {JSX.Element|null}
     */
    genField(path, key, defaultValue) {
      const propType = this.checkPropType(key, path);
      // const defaultValue = isFunction(val) ? val() : val;
      const propPath = [...path, key];

      const params = [propPath, key, defaultValue];

      const disabled = ([
        ...PERM_DISABLED,
        ...(this.nodeInfo.disabledProps || [])
      ]).includes(key);

      if (disabled) return null;

      if (propType === 'boolean') {
        return this.genCheckbox(...params);
      }

      if (propType === 'array') {
        return this.genTextarea(...params);
      }

      if (key === 'icon') {
        return this.genIconSelector(...params);
      }

      return this.genTextField(...params);
    },

    /**
     * Map properties from block to schema object
     * @param {Object} obj
     * @param {string[]} path
     * @returns {(JSX.Element|null)[]}
     */
    mapPropsFields(obj, path) {
      return Object.keys(obj)
        .filter((prop) => prop !== 'tag')
        .map((prop) => this.genField(path, prop, obj[prop]))
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
          [...this.nodePath, 'data', 'props']
        );

      const proxyPropsFields = () => Object.keys(proxyProps)
        .map((component) => this
          .mapPropsFields(
            proxyProps[component],
            [...this.nodePath, 'data', 'proxyProps', component]
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

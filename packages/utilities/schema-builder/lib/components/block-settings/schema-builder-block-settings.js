import {
  isArray,
  kindOf,
  objectPath,
  deepFind,
  capitalCase
} from '@deip/toolbox';

import { cloneDeep } from '@deip/toolbox/lodash';

/* eslint-disable */
import {
  VTextField,
  VCheckbox
} from 'vuetify/lib/components';
import { VexStack } from '@deip/vuetify-extended';
/* eslint-enable */

import { SchemeView } from '../../mixins';
import { convertBlockPropsForCanvas } from '../../utils/helpers';

const PERM_DISABLED = ['proxyProps'];

export const SchemaBuilderBlockSettings = {
  name: 'SchemaBuilderBlockSettings',

  mixins: [SchemeView],

  computed: {
    nodePath() {
      if (!this.activeNode) return '';

      return deepFind(this.internalSchema, this.activeNode).slice(0, -1);
    },

    nodeInfo() {
      const { id } = objectPath.get(this.internalSchema, this.nodePath);
      return this.getNodeInfo(id);
    }
  },

  methods: {
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

    setFieldVal(path, value) {
      const updated = cloneDeep(this.internalSchema);

      objectPath.set(updated, path, value);
      this.internalSchema = updated;
    },

    genFieldProps(label) {
      return {
        hideDetails: true,
        label: capitalCase(label)
      };
    },

    genTextField(path, label, value) {
      const initVal = objectPath.get(this.internalSchema, path, value);
      const props = this.genFieldProps(label);

      return (
        <VTextField
          {...{ props }}
          class="ma-0"
          value={initVal === false ? '' : initVal}
          onInput={(v) => this.setFieldVal(path, v)}
        />
      );
    },

    genCheckbox(path, label, value) {
      const initVal = objectPath.get(this.internalSchema, path, value);
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

    genField(path, key, val) {
      const propType = this.checkPropType(key, path);

      const disabled = ([
        ...PERM_DISABLED,
        ...(this.nodeInfo.disabledProps || [])
      ]).includes(key);

      if (disabled) return null;

      if (propType === 'boolean') {
        return this.genCheckbox([...path, key], key, val);
      }

      return this.genTextField([...path, key], key, val);
    },

    // genPlaceholder() {
    //   return (
    //     <div class="text-caption text--secondary">
    //       This block has no settings
    //     </div>
    //   );
    // },

    mapPropsFields(obj, path) {
      return Object.keys(obj)
        .filter((prop) => prop !== 'tag')
        .map((prop) => this.genField(path, prop, obj[prop]))
        .filter((f) => f);
    },

    genFields() {
      const info = convertBlockPropsForCanvas(this.nodeInfo);
      const mainProps = objectPath.get(info, ['data', 'props'], {});
      const proxyProps = objectPath.get(info, ['data', 'proxyProps'], {});

      const mainPropsFields = this
        .mapPropsFields(
          mainProps,
          [...this.nodePath, 'data', 'props']
        );

      const proxyPropsFields = Object.keys(proxyProps)
        .map((component) => this
          .mapPropsFields(
            proxyProps[component],
            [...this.nodePath, 'data', 'proxyProps', component]
          ));

      const additionalFields = [
        this.genTextField(
          [...this.nodePath, 'data', 'staticClass'],
          'Additional class'
        )
      ];

      // if (!mainProps.length && !proxyProps.length) return [this.genPlaceholder()];

      return [
        mainPropsFields,
        proxyPropsFields,
        additionalFields
      ];
    }
  },

  render(h) {
    if (this.activeNode) {
      return h(VexStack, this.genFields());
    }

    return (
      <div class="text-caption text--secondary">
        Select an element on the canvas to activate this panel.
      </div>
    );
  }
};

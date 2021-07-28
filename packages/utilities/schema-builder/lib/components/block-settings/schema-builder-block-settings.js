import {
  isArray,
  kindOf,
  objectPath,
  deepFind,
  capitalCase
} from '@deip/toolbox';

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

    propsPath() {
      if (!this.activeNode) return '';

      return {
        main: [...this.nodePath, 'data', 'props'],
        proxy: [...this.nodePath, 'data', 'proxyProps']
      };
    },

    nodeProps() {
      if (!this.activeNode) return false;

      const normalized = convertBlockPropsForCanvas(this.nodeInfo);

      return {
        main: objectPath.get(normalized, ['data', 'props'], {}),
        proxy: objectPath.get(normalized, ['data', 'proxyProps'], {})
      };
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

    genField(path, key, val) {
      const propType = this.checkPropType(key, path);

      const disabled = ([
        ...PERM_DISABLED,
        ...(this.nodeInfo.disabledProps || [])
      ]).includes(key);

      const setVal = (value) => {
        objectPath.set(this.internalSchema, [...path, key], value);
      };

      const initVal = objectPath.get(this.internalSchema, [...path, key], val);

      if (disabled) return null;

      const props = {
        hideDetails: true,
        label: capitalCase(key),
        disabled
      };

      if (propType === 'boolean') {
        return (
          <VCheckbox
            {...{ props }}
            class="ma-0 pa-0"
            value={initVal}
            onChange={setVal}
          />
        );
      }

      return (
        <VTextField
          {...{ props }}
          class="ma-0"
          value={initVal === false ? '' : initVal}
          onInput={setVal}
        />
      );
    },

    genPlaceholder() {
      return (
        <div class="text-caption text--secondary">
          This block has no settings
        </div>
      );
    },

    mapFields(obj = {}, path = this.propsPath.main) {
      return Object.keys(obj)
        .filter((prop) => prop !== 'tag')
        .map((prop) => this.genField(path, prop, obj[prop]))
        .filter((f) => f);
    },

    genFields() {
      const mainProps = this.mapFields(this.nodeProps.main, this.propsPath.main);

      const proxyProps = Object.keys(this.nodeProps.proxy)
        .map((component) => this.mapFields(
          this.nodeProps.proxy[component],
          [...this.propsPath.proxy, component]
        ));

      if (!mainProps.length && !proxyProps.length) return [this.genPlaceholder()];

      return [
        mainProps,
        proxyProps
      ];
    }
  },

  render(h) {
    return h(VexStack, this.genFields());
  }
};

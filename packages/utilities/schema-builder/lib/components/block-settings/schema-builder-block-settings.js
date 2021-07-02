import {
  isArray,
  kindOf,
  dotProp,
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

export const SchemaBuilderBlockSettings = {
  name: 'SchemaBuilderBlockSettings',

  mixins: [SchemeView],

  computed: {
    nodePath() {
      if (!this.activeNode) return '';

      return deepFind(this.internalSchema, this.activeNode).slice(0, -1).join('.');
    },

    propsPath() {
      if (!this.activeNode) return '';

      return [this.nodePath, 'data', 'props'].join('.');
    },

    nodeProps() {
      if (!this.activeNode) return {};

      return dotProp.get(this.internalSchema, this.propsPath);
    },

    nodeInfo() {
      const { id } = dotProp.get(this.internalSchema, this.nodePath);
      return this.getNodeInfo(id);
    }
  },

  methods: {

    checkPropType(key) {
      const type = this.nodeInfo.data.props[key]?.type;

      if (!type) return kindOf(String());

      if (isArray(type)) {
        const acc = type.map((t) => kindOf(t()));

        if (acc.includes('number')) return kindOf(Number());

        return acc[0];
      }

      return kindOf(type());
    },

    genField(key, val) {
      const propType = this.checkPropType(key);
      const disabled = (this.nodeInfo.disabledProps || []).includes(key);

      const setVal = (value) => {
        dotProp.set(this.internalSchema, `${this.propsPath}.${key}`, value);
      };

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
            value={val}
            onChange={setVal}
          />
        );
      }

      return (
        <VTextField
          {...{ props }}
          class="ma-0"
          value={val === false ? '' : val}
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

    genFields() {
      if (!this.nodeProps) return [this.genPlaceholder()];

      const fields = Object.keys(this.nodeProps)
        .filter((prop) => prop !== 'tag')
        .map((prop) => this.genField(prop, this.nodeProps[prop]))
        .filter((f) => f);

      if (!fields.length) return [this.genPlaceholder()];

      return fields;
    }
  },

  render(h) {
    return h(VexStack, this.genFields());
  }
};

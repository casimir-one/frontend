/* eslint-disable */
import {
  VIcon,
  VBtn,
  VSpacer,
  VSheet,
  VDivider
} from 'vuetify/lib/components';
/* eslint-enable */

import draggable from 'vuedraggable';
import { SchemeView } from '../../mixins';

export const VlsBuilderCanvasTree = {
  name: 'SchemaBuilderCanvasTree',

  mixins: [SchemeView],

  data() {
    return {
      toggleMap: {}
    };
  },

  methods: {
    toggle(id, state) {
      this.$set(this.toggleMap, id, state);
    },

    genItem(item, level = 0) {
      const node = this.getNodeInfo(item.id);
      const lines = new Array(level).fill(
        this.$createElement(VDivider, { props: { vertical: true }, style: { marginRight: '15px' } })
      );

      return this.$createElement(
        'div',
        { class: 'd-flex' },
        [
          ...lines,
          this.$createElement(VIcon, { class: 'mr-2', props: { size: 16 } }, node.icon),
          this.$createElement(VSpacer, { class: 'text-caption' }, node.name)
        ]
      );
    },

    genNodeSpace(child) {
      return this.$createElement(
        VSheet,
        {
          props: {
            width: 18,
            height: 18,
            color: 'transparent'
          },
          class: 'd-flex justify-center'
        },
        [child]
      );
    },

    genNodeToggler(id) {
      return this.$createElement(
        VBtn,
        {
          props: { icon: true, width: 18, height: 18 },
          on: {
            click: (e) => {
              e.stopPropagation();
              this.toggle(id, !this.toggleMap[id]);
            }
          }
        },
        [
          this.$createElement(
            VIcon,
            { props: { size: 16 } },
            this.toggleMap[id] ? 'mdi-chevron-down' : 'mdi-chevron-right'
          )
        ],
      );
    },

    genNode(item, level = 0) {
      const { icon, name } = this.getNodeInfo(item.id);
      const { uid } = item;

      const lines = new Array(level).fill(
        this.genNodeSpace(this.$createElement(VDivider, { props: { vertical: true } }))
      );

      lines.push(this.genNodeSpace(item?.children?.length ? this.genNodeToggler(uid) : ''));

      const head = this.$createElement(
        VSheet, {
          class: {
            'd-flex': true
          },
          props: {
            color: this.activeNode === uid ? 'primary lighten-4' : 'transparent'
          },
          on: {
            click: () => {
              this.setActiveNode(uid);
            }
          }
        },
        [
          ...lines,
          this.$createElement(VIcon, { class: 'mr-2', props: { size: 16 } }, icon),
          this.$createElement(VSpacer, { class: 'text-caption' }, name)
        ]
      );

      const deepLevel = level + 1;
      const els = [head];

      if (item.children) {
        els.push(this.genDragger(item.children, deepLevel, !!this.toggleMap[uid]));
      }

      return this.$createElement('div', els);
    },

    genDragger(list, level = 0, visible = true) {
      return this.$createElement(
        draggable,
        {
          props: { list },
          class: {
            'd-none': !visible
          },
          attrs: {
            group: { name: 'blocksTree' }
          }
        },
        list.map((el) => this.genNode(el, level))
      );
    }
  },

  render(h) {
    return h('div', { staticClass: 'schema-tree' }, [this.genDragger(this.internalSchema)]);
  }
};

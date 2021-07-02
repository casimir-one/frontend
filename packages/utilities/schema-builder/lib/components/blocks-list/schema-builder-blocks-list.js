/* eslint-disable */
import {
  VBtn,
  VSheet,
  VIcon,
  VDivider,
  VMenu,
  VList,
  VListItem,
  VListItemIcon,
  VListItemContent
} from 'vuetify/lib/components';

import { VexExpand } from '@deip/vuetify-extended';
/* eslint-enable */

import draggable from 'vuedraggable';

import { ATTR_TYPES } from '@deip/constants';
import { clearBlock } from '../../utils/helpers';

export const SchemaBuilderBlocksList = {
  name: 'SchemaBuilderBlocksList',

  components: {
    draggable
  },

  props: {
    blocks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      toggleMap: {}
    };
  },

  methods: {
    onClone(block) {
      this.$emit('clone');
      return clearBlock(block);
    },

    genSection(section) {
      const sect = this.$createElement(
        VexExpand,
        {
          props: {
            value: true
          },
          scopedSlots: {
            activator: ({ active }) => this.$createElement(
              VSheet,
              {
                slot: 'activator',
                staticClass: 'px-6 py-3 d-flex',
                props: {
                  color: 'neutral lighten-5'
                }
              },
              [
                this.$createElement('div', { staticClass: 'text-subtitle-2 spacer' }, section.title),
                this.$createElement(VIcon, { props: { size: 16 } }, active ? 'mdi-chevron-down' : 'mdi-chevron-up')
              ]
            )
          }
        },
        [
          this.$createElement(VDivider),
          this.genDragOut(section.blocks)
        ]
      );

      return this.$createElement('div', [
        sect,
        this.$createElement(VDivider)
      ]);
    },

    genDragOut(blocks) {
      return this.$createElement(
        draggable,
        {
          props: { list: blocks, clone: this.onClone },
          attrs: {
            sort: false,
            group: { name: 'blocks', pull: 'clone', put: false }
          },
          staticClass: 'schema-blocks__list neutral lighten-4'
        },
        blocks.map((block) => this.genBlock(block))
      );
    },

    genBlockMenu(block) {
      if (block.blockType === 'attribute') {
        const scopedSlots = {
          activator: ({ on }) => (
            <VBtn
              slot='activator'
              width={20}
              height={20}
              absolute
              style="right: 4px; top: 4px"
              icon
              vOn:click={on.click}
              vOn:keydown={on.keydown}
            >
              <VIcon size={12}>mdi-dots-vertical</VIcon>
            </VBtn>
          )
        };

        const { id, dataType } = block;

        const menu = [
          {
            icon: 'mdi-pound-box-outline',
            label: 'Copy attribute ID',
            action: () => { this.$clipboard(id); }
          },

          {
            icon: 'mdi-text-box-multiple-outline',
            label: 'Copy attribute value',
            action: () => { this.$clipboard(`@getAttributeValue('${id}')`); }
          },

          {
            icon: 'mdi-checkbox-multiple-marked-outline',
            label: 'Copy attribute condition',
            action: () => { this.$clipboard(`@ifAttributeValue('${id}')`); }
          },

          ...(dataType === ATTR_TYPES.IMAGE
            ? [{
              icon: 'mdi-image-multiple-outline',
              label: 'Copy image url',
              action: () => { this.$clipboard(`@getAttributeFileSrc('${id}')`); }
            }] : [])

        ].map((item) => (
          <VListItem vOn:click={item.action}>
            <VListItemIcon><VIcon>{item.icon}</VIcon></VListItemIcon>
            <VListItemContent>{item.label}</VListItemContent>
          </VListItem>
        ));

        return (
          <VMenu scopedSlots={scopedSlots}>
            <VList>
              {menu}
            </VList>
          </VMenu>
        );
      }

      return null;
    },

    genBlock(block) {
      return (
        <VSheet class="pa-4 text-center font-weight-medium pos-relative" style="font-size:11px">
          <VIcon class="mb-1">{block.icon || 'mdi-card-outline'}</VIcon>
          <div>{block.name}</div>
          {this.genBlockMenu(block)}
        </VSheet>
      );
    }
  },

  render(h) {
    if (!this.blocks.length) return h('div', 'No blocks found');
    return h(
      'div',
      this.blocks
        .map((section) => this.genSection(section))
    );
  }
};

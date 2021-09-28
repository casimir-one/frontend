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

import {
  Ripple
} from 'vuetify/lib/directives';

import { VexExpand } from '@deip/vuetify-extended';
/* eslint-enable */

import draggable from 'vuedraggable';

import { ATTR_TYPES } from '@deip/constants';
import { convertBlockForSchema } from '../../utils/helpers';
import { mutations } from '../../store';

export const VlsBuilderBlocksList = {
  name: 'VlsBuilderBlocksList',

  components: {
    draggable
  },

  directives: {
    Ripple
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
      mutations.setActiveNode(null);
      return convertBlockForSchema(block);
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
                staticClass: 'px-6 py-3 d-flex'
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
          staticClass: 'schema-blocks__list'
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

        const { dataType } = block;
        const { attributeId } = block.data.props;

        const menu = [
          {
            icon: 'mdi-pound-box-outline',
            label: 'Copy attribute ID',
            action: () => { this.$clipboard(attributeId); }
          },

          {
            icon: 'mdi-text-box-multiple-outline',
            label: 'Copy attribute value',
            action: () => { this.$clipboard(`{{('${attributeId}')::getAttributeValue}}`); }
          },

          {
            icon: 'mdi-checkbox-multiple-marked-outline',
            label: 'Copy attribute condition',
            action: () => { this.$clipboard(`{{('${attributeId}')::attributeHasValue}}`); }
          },

          ...(dataType === ATTR_TYPES.IMAGE
            ? [{
              icon: 'mdi-image-multiple-outline',
              label: 'Copy image url',
              action: () => { this.$clipboard(`{{('${attributeId}')::getAttributeFileSrc}}`); }
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
      // {...{ directives: [Ripple] }}
      return (
        <VSheet
          class="schema-blocks__block pa-4 text-center font-weight-medium pos-relative"
          style="font-size:11px"
          vRipple
        >
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
      this.blocks.filter((b) => b?.blocks?.length)
        .map((section) => this.genSection(section))
    );
  }
};

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

import { VexExpand } from '@casimir/vuetify-extended';
/* eslint-enable */

import draggable from 'vuedraggable';

import { convertBlockForSchema } from '../../utils/helpers';

import { BuilderMixin } from '../../mixins';

/**
 * @typedef {Object} Block
 * @property {string} blockType
 * @property {Array.<Block>} [children]
 * @property {Object} [data]
 * @property {Array.<string>} [disabledProps]
 * @property {string} icon
 * @property {string} id
 * @property {string} is
 * @property {string} [layoutType]
 * @property {string} name
 * @property {Array.<string>} [scope]
 * @property {string} [text]
 *
 * @typedef {Object} BlockWithUid
 * @property {string} uid
 *
 * @typedef {Block & BlockWithUid} BlockForSchema
 */

/**
 * Builder blocks
 */
export default {
  name: 'VlsBuilderBlocks',

  directives: {
    Ripple
  },

  mixins: [BuilderMixin],

  data() {
    return {
      toggleMap: {}
    };
  },

  methods: {
    /**
     * Clone dragged block
     * @param {Block} block
     * @returns {BlockForSchema}
     */
    onClone(block) {
      /**
       * Clone block event
       */
      this.$emit('clone');
      this.setContainerActiveNode(null);

      return convertBlockForSchema(block);
    },

    /**
     * Generate section
     * @param {Object} section
     * @param {string} section.title
     * @param {Array} section.array
     * @returns {JSX.Element}
     */
    genSection(section) {
      const expandActivatorSlots = {
        scopedSlots: {
          activator: ({ active }) => (
            <VSheet class="px-6 py-3 d-flex">
              <div class="text-subtitle-2 spacer">{section.title}</div>
              <VIcon size={16}>{active ? 'mdi-chevron-down' : 'mdi-chevron-up'}</VIcon>
            </VSheet>
          )
        }
      };

      return (
        <div>
          <VexExpand value={true} { ...expandActivatorSlots }>
            <VDivider />
            {this.genDragOut(section.blocks)}
          </VexExpand>
          <VDivider />
        </div>
      );
    },

    /**
     * Generate container with draggable blocks
     * @param {Array.<Block>} blocks
     * @returns {JSX.Element}
     */
    genDragOut(blocks) {
      return (
        <draggable
          class="vls-builder-blocks__list"
          list={blocks}
          clone={this.onClone}
          sort={false}
          group={{ name: 'blocks', pull: 'clone', put: false }}
        >
          {blocks.map((block) => this.genBlock(block))}
        </draggable>
      );
    },

    /**
     * Generate block menu
     * @param {Array.<Object>} menu
     * @param {Function} menu.action
     * @param {string} menu.icon
     * @param {string} menu.label
     * @returns {JSX.Element}
     */
    genBlockMenu(menu) {
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

      const menuItems = menu.map((item) => (
        <VListItem vOn:click={item.action}>
          <VListItemIcon><VIcon>{item.icon}</VIcon></VListItemIcon>
          <VListItemContent>{item.label}</VListItemContent>
        </VListItem>
      ));

      return (
        <VMenu scopedSlots={scopedSlots}>
          <VList>
            {menuItems}
          </VList>
        </VMenu>
      );
    },

    /**
     * Generate attribute menu
     * @param {Block} block
     * @returns {JSX.Element}
     */
    genAttributeMenu(block) {
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

        ...(dataType === 'image'
          ? [{
            icon: 'mdi-image-multiple-outline',
            label: 'Copy image url',
            action: () => { this.$clipboard(`{{('${attributeId}')::getAttributeFileSrc}}`); }
          }] : [])

      ];

      return this.genBlockMenu(menu);
    },

    /**
     * Generate value menu
     * @param {Block} block
     * @returns {JSX.Element}
     */
    genValueMenu(block) {
      const menu = [
        {
          icon: 'mdi-pound-box-outline',
          label: 'Copy value',
          action: () => { this.$clipboard(block.text); }
        }

      ];

      return this.genBlockMenu(menu);
    },

    /**
     * Generate block
     * @param {Block} block
     * @returns {JSX.Element}
     */
    genBlock(block) {
      return (
        <VSheet
          class="vls-builder-blocks__block pa-4 text-center font-weight-medium pos-relative"
          style="font-size:11px"
          vRipple
        >
          <VIcon class="mb-1">{block.icon || 'mdi-card-outline'}</VIcon>
          <div>{block.name}</div>
          {block.blockType === 'attribute' ? this.genAttributeMenu(block) : null}
          {block.blockType === 'value' ? this.genValueMenu(block) : null}
        </VSheet>
      );
    }
  },

  render() {
    if (!this.containerBlocks.length) return <div>No blocks found</div>;

    const blocksList = this.containerBlocks
      .filter((b) => b?.blocks?.length)
      .map((section) => this.genSection(section));

    return (
      <div>
        {blocksList}
      </div>
    );
  }
};

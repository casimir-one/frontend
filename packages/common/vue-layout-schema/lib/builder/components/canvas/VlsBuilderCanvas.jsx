/* eslint-disable */
import {
  VIcon, VSheet,
  VDivider, VSpacer,
  VBtn, VAlert, VCol
} from 'vuetify/lib/components';
import { ClickOutside } from 'vuetify/lib/directives';

/* eslint-enable */

import { VeRawDisplay } from '@deip/vue-elements';

import { deepFindParentByValue, paramCase } from '@deip/toolbox';
import { merge } from '@deip/toolbox/lodash';
import draggable from 'vuedraggable';
import { BuilderMixin } from '../../mixins';

/**
 * @typedef {Object} SchemaNode
 * @property {string} is
 * @property {string} uid
 * @property {Object} data
 * @property {string} [model]
 * @property {Array} [children]
 * @property {boolean} [condition]
 * @property {string} [text]
 */

/**
 * Builder canvas
 */
export default {
  name: 'VlsBuilderCanvas',

  directives: {
    ClickOutside
  },

  mixins: [BuilderMixin],

  data() {
    return {
      hoverBox: {},
      focusBox: {},

      isMoved: false,
      cleanedBlocks: []
    };
  },

  watch: {
    schemaAcc: {
      handler() {
        this.$nextTick(() => {
          if (this.containerActiveNode) {
            this.focusBox = this.getNodeBoxData(this.containerActiveNode);
          }
        });
      },
      deep: true
    }
  },

  methods: {
    /**
     * Return canvas block type based on  info from blocks list
     * @param {string} id
     * @returns {string}
     */
    getBlockType(id) {
      const blockInfo = this.getContainerNodeInfo(id);

      if (!blockInfo) {
        return 'undefined';
      }

      return blockInfo.blockType || paramCase(blockInfo.name);
    },

    /**
     * Get node attributes
     * @param {SchemaNode} node
     * @return {Object}
     */
    getNodeAttrs(node) {
      const props = node?.data?.props || {};
      return Object.keys(props).reduce((acc, prop) => ({
        ...acc,
        ...{
          [`data-${paramCase(prop)}`]: props[prop]
        }
      }), {});
    },

    /**
     * Get node info for hovered/selected marker position
     * @param {string} uid
     * @returns {null|Object}
     */
    getNodeBoxData(uid) {
      if (!uid) return null;

      const { id } = deepFindParentByValue(this.schemaAcc, uid);

      const {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight
      } = this.$refs[`node-${uid}`];

      return {
        styles: {
          left: `${offsetLeft}px`,
          top: `${offsetTop}px`,
          width: `${offsetWidth}px`,
          height: `${offsetHeight}px`,
          display: 'block'
        },
        info: this.getContainerNodeInfo(id),
        uid
      };
    },

    /**
     * Set hover node data
     * @param {string} uid
     */
    hoverNode(uid) {
      if (!uid || this.isMoved) {
        this.hoverBox = {};
      } else {
        this.hoverBox = this.getNodeBoxData(uid);
      }
    },

    /**
     * Set selected node data
     */
    selectNode() {
      this.hoverNode(null);

      if (!this.containerActiveNode) {
        this.focusBox = {};
      } else {
        this.focusBox = this.getNodeBoxData(this.containerActiveNode);
      }
    },

    /**
     * @param {SchemaNode} node
     * @return {boolean}
     */
    isFocused(node) {
      return !!this.containerActiveNode
      && this.containerActiveNode === node.uid;
    },

    // //////////////////////////

    /**
     * Generate draggable host on canvas
     * @param {Object} additionData
     * @param {Object[]} list
     * @returns {JSX.Element}
     */
    genHost(
      additionData = {},
      list
    ) {
      const reset = () => {
        this.isMoved = true;
        this.setContainerActiveNode(null);
      };

      const baseData = {
        props: { list },
        attrs: { group: { name: 'blocks' } },
        on: {
          clone: reset,
          start: reset,
          end: () => {
            this.isMoved = false;
          }
        }
      };

      return (
        <draggable {...merge(baseData, additionData)}>
          {this.genNodes(list)}
        </draggable>
      );
    },

    /**
     * Wrapper for {@link genHost}. Set additional data and point list to node children
     * @param {SchemaNode} node
     * @returns {JSX.Element|*[]}
     */
    genChildrenHost(node) {
      if (!node?.children) return [];

      const data = {
        class: [
          'vls-builder-canvas__node-host',
          `vls-builder-canvas__node-host--${this.getBlockType(node.id)}`
        ],
        attrs: this.getNodeAttrs(node)
      };

      return this.genHost(data, node.children);
    },

    // //////////////////////////

    /**
     * Generate node markup for simple node.
     * Display only icon and title.
     * Can't accept children.
     * @param {string} icon
     * @param {string} title
     * @returns {JSX.Element}
     */
    genSimpleNodeMarkup(icon, title) {
      return (
        <VSheet class="d-flex align-center">
          <VSheet width="32px" height="32" class="d-flex align-center justify-center">
            <VIcon size={18}>{icon}</VIcon>
          </VSheet>
          <VDivider vertical class="mr-3"/>
          <div class="text-caption font-weight-medium pr-3">{title}</div>
        </VSheet>
      );
    },

    /**
     * Generate node markup for container node.
     * Has icon on left side.
     * Has drag-n-drop host.
     * @param {string} icon
     * @param {(JSX.Element | JSX.Element[])} content
     * @returns {JSX.Element}
     */
    genExtendedNodeMarkup(icon, content) {
      return (
        <VSheet class="d-flex align-center">
          <VSheet width="40px" height="40" class="d-flex align-center justify-center flex-shrink-0">
            <VIcon>{icon}</VIcon>
          </VSheet>
          <VDivider vertical class="mr-1"/>
          <VSpacer>
            {content}
          </VSpacer>
        </VSheet>
      );
    },

    // //////////////////////////

    /**
     * Generate undefined node if canvas can't get node info from blocks
     * @returns {JSX.Element}
     */
    genUndefinedNode() {
      return this.genSimpleNodeMarkup(
        'mdi-alert-circle-outline',
        'Undefined block'
      );
    },

    /**
     * Generate simple node (without children)
     * @param {SchemaNode} node
     * @returns {JSX.Element}
     */
    genSimpleNode(node) {
      const { icon, name } = this.getContainerNodeInfo(node.id);
      return this.genSimpleNodeMarkup(icon, name);
    },

    /**
     * Generate container node with children host and icon at left side
     * @param {SchemaNode} node
     * @returns {JSX.Element}
     */
    genExtendedNode(node) {
      const { icon } = this.getContainerNodeInfo(node.id);
      return this.genExtendedNodeMarkup(icon, this.genChildrenHost(node));
    },

    /**
     * Generate container node with children host and icon at left side
     * @param {SchemaNode} node
     * @returns {JSX.Element}
     */
    genContentNode(node) {
      const { icon } = this.getContainerNodeInfo(node.id);

      const content = () => (
        <div {...{ style: { paddingLeft: '8px' } }}>{node.text}</div>
      );

      return this.genExtendedNodeMarkup(icon, content());
    },

    /**
     * Generate container node with children host
     * @param {SchemaNode} node
     * @returns {JSX.Element}
     */
    genDefaultNode(node) {
      return this.genChildrenHost(node);
    },

    // //////////////////////////

    /**
     * Select node generator based on block type
     * @param blockType
     * @returns {function(): void}
     */
    getNodeGenerator(blockType) {
      if (blockType === 'undefined') {
        return this.genUndefinedNode;
      }

      if (['attribute', 'component', 'simple', 'value'].includes(blockType)) {
        return this.genSimpleNode;
      }

      if (['typography'].includes(blockType)) {
        return this.genExtendedNode;
      }

      if (['content'].includes(blockType)) {
        return this.genContentNode;
      }

      return this.genDefaultNode;
    },

    // //////////////////////////

    /**
     * Generate list of nodes on canvas
     * @param {Array.<SchemaNode>} nodes
     * @returns {JSX.Element[]}
     */
    genNodes(nodes) {
      return nodes.map((node) => {
        const blockType = this.getBlockType(node.id);

        if (blockType === 'undefined') {
          this.cleanedBlocks.push(node.name || node.is || node.id);
          this.removeContainerNode(node.id);
        }

        const generator = this.getNodeGenerator(blockType);

        const classList = {
          'vls-builder-canvas__node': true,
          'vls-builder-canvas__node--active': this.containerActiveNode === node.uid,
          [`vls-builder-canvas__node--${blockType}`]: true
        };

        return (
          <div
            class={classList}
            ref={`node-${node.uid}`}
            vOn:click_stop={() => {
              this.setContainerActiveNode(node.uid);
            }}
            vOn:mouseover_stop={() => {
              this.hoverNode(node.uid);
            }}
            vOn:mouseleave_stop={() => {
              this.hoverNode(null);
            }}
            { ...{ attrs: this.getNodeAttrs(node) }}
          >{generator(node)}</div>
        );
      });
    },

    /**
     * @returns {JSX.Element}
     */
    genHoverBox() {
      return (
        <div
          class="vls-builder-canvas__hover-box"
          style={this.hoverBox?.styles || {}}
          ref="hover-box"
        >
          <div class="vls-builder-canvas__hover-box-header">
            <div class="vls-builder-canvas__box-label">
              {this.hoverBox?.info?.name}
            </div>
          </div>
        </div>
      );
    },

    /**
     * @returns {JSX.Element}
     */
    genFocusBox() {
      return (
        <div
          class="vls-builder-canvas__focus-box"
          style={this.focusBox?.styles || {}}
          ref="focus-box"
        >
          <div class="vls-builder-canvas__focus-box-header">
            <div class="vls-builder-canvas__box-label">
              {this.focusBox?.info?.name}
            </div>
            <VBtn
              icon
              width={16}
              height={16}
              class="mr-n1 mt-n1 mb-n1"
              color="white"
              onClick={() => {
                this.removeContainerNode(this.focusBox?.uid);
              }}
            >
              <VIcon size={12}>mdi-close</VIcon>
            </VBtn>
          </div>
        </div>
      );
    },

    genCleanedBox() {
      const list = [...new Set(this.cleanedBlocks)].join(', ');

      return (
        <VAlert text color="error">
          <VRow>
            <VCol>
              <div className="text-body-2">
                <strong>{list}</strong> was cleaned as not allowed for current layout settings
              </div>
            </VCol>
            <VCol cols="auto">
              <VBtn
                color="error"
                icon
                onClick={() => { this.cleanedBlocks = []; }}
              >
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VCol>
          </VRow>
        </VAlert>
      );
    }
  },

  render() {
    const composer = this.genHost({
      class: ['vls-builder-canvas__host']
    }, this.schemaAcc);

    return (
      <div class="vls-builder-canvas">
        {this.cleanedBlocks.length ? this.genCleanedBox() : null}
        <div
          class="vls-builder-canvas__pane"
          vClickOutside={{
            handler: () => {
              this.setContainerActiveNode(null);
            },
            include: () => [
              document.querySelector('.vls-builder-tree'),
              document.querySelector('.vls-builder-settings'),
              document.querySelector('.v-menu__content')
            ].filter((el) => el)
          }}
        >
          {this.genHoverBox()}
          {this.genFocusBox()}
          {composer}
        </div>

        {
          process.env.NODE_ENV === 'development'
            ? <VeRawDisplay value={this.schemaAcc}/>
            : null
        }

      </div>
    );
  }
};

import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
import draggable from 'vuedraggable';
import { pascalCase } from 'change-case';
import { find } from 'find-keypath';
import dotProp from 'dot-prop';
import mergeData from 'vuetify/lib/util/mergeData';

import './SchemaComposer.scss';
import { normalizeBlocksObject } from '../../utils/helpers';

export const SchemaComposer = {
  name: 'SchemaComposer',

  mixins: [ ProxyableFactory('schema') ],

  props: {
    blocks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      selectedNode: null,
      hoverBox: {},
      focusBox: {},
    }
  },

  computed: {
    normalizedBlocks() {
      return normalizeBlocksObject(this.blocks)
    }
  },

  methods: {

    getNodeBoxData(node) {
      const { name, uid, id } = node;
      const {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight
      } = this.$refs[`node-${uid}`];

      return {
        uid,
        id,
        name,
        styles: {
          left: `${offsetLeft}px`,
          top: `${offsetTop}px`,
          width: `${offsetWidth}px`,
          height: `${offsetHeight}px`,
          display: 'block'
        }
      }
    },

    onNodeHover(node) {
      this.hoverBox = this.getNodeBoxData(node);
    },

    onNodeFocus(node) {
      this.hoverBox = {};
      this.focusBox = this.getNodeBoxData(node);
    },

    getNodeInfo(id) {
      return dotProp.get(
        this.normalizedBlocks,
        find(this.normalizedBlocks, id).slice(0, -1).join('.')
      );
    },

    genHost(nodes, data = {}) {
      const host = this.$createElement(
        draggable,
        {
          props: { list: nodes },
          attrs: {
            group: { name: 'blocks' }
          },
        },
        nodes.map((node) => this.genNode(node))
      )
      host.data = mergeData(host.data, data);

      return host;
    },

    genChildrenHost(node) {
      if (!node?.children) return [];

      const data = {
        class: [
          'schema-composer__node-host',
          `schema-composer__node-host--${node.type || 'block'}`
        ]
      };

      return this.genHost(node.children, data)
    },

    genNodeLabel(node) {
      return this.$createElement(
        'div',
        {}
      )
    },

    genNodeContentBlock(node) {
      const nodeInfo = this.getNodeInfo(node.id);

      return [
        nodeInfo.name,
        this.genChildrenHost(node)
      ]
    },

    genNodeContentRow(node) {
      return [
        this.genChildrenHost(node)
      ]
    },

    genNode(node) {
      const { type = 'Block' } = node;

      const content = this[`genNodeContent${pascalCase(type)}`](node);
      let isHovered = false;

      return this.$createElement(
        'div',
        {
          props: {},
          class: {
            'schema-composer__node': true,
            'schema-composer__node--active': this.selectedNode === node.uid,
            'schema-composer__node--active c': isHovered,
            [`schema-composer__node--${node.type || 'common'}`]: true,
          },
          ref: `node-${node.uid}`,
          on: {
            click: (e) => {
              e.stopPropagation();
              this.onNodeFocus(node);
              this.$emit('select-node', node.uid)
            },
            mouseover: (e) => {
              e.stopPropagation();
              this.onNodeHover(node);
            },
          }
        },
        content
      )
    },

    genHoverBox() {
      return this.$createElement('div', {
        class: [ 'schema-composer__hover-box' ],
        style: this.hoverBox.styles,
        ref: 'hover-box'
      })
    },
    genFocusBox() {
      return this.$createElement('div', {
        class: [ 'schema-composer__focus-box' ],
        style: this.focusBox.styles,
        ref: 'focus-box'
      })
    }
  },

  render(h) {
    return this.$createElement(
      'div',
      { class: [ 'schema-composer' ] },
      [
        this.genHoverBox(),
        this.genFocusBox(),
        this.genHost(
          this.schema,
          {
            class: [ 'schema-composer__host' ],
            on: {
              click: () => {
                console.log(1)
              },
              mouseleave: () => {
                console.log(1)
                this.hoverBox = {}
              }
            }
          }
        )
      ]
    )
  }
}

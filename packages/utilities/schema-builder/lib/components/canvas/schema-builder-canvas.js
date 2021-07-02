/* eslint-disable */
import {
  VIcon, VSheet, VDivider, VSpacer
} from 'vuetify/lib/components';
/* eslint-enable */

import './schema-builder-canvas.scss';

import { wrapInArray, pascalCase } from '@deip/toolbox';
import draggable from 'vuedraggable';
import { SchemeView } from '../../mixins';

export const SchemaBuilderCanvas = {
  name: 'SchemaBuilderCanvas',

  mixins: [SchemeView],

  data() {
    return {
      hoverBox: {},
      focusBox: {}
    };
  },

  methods: {
    getBlockType(id) {
      const { blockType = 'common' } = this.getNodeInfo(id);
      return blockType;
    },

    getNodeBoxData(uid) {
      if (!uid) return false;

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
        }
      };
    },

    hoverNode(uid) {
      this.hoverBox = this.getNodeBoxData(uid);
    },

    selectNode(uid) {
      this.hoverBox = {};
      this.focusBox = this.getNodeBoxData(uid);
      this.$emit('select-node', uid);
    },

    genHost(nodes, data = {}) {
      return (
        <draggable
          list={nodes}
          group={{ name: 'blocks' }}
          { ...data }
        >
          {nodes.map((node) => this.genNode(node))}
        </draggable>
      );
    },

    genChildrenHost(node) {
      if (!node?.children) return [];

      const data = {
        class: [
          'schema-composer__node-host',
          `schema-composer__node-host--${this.getBlockType(node.id)}`
        ]
      };

      return this.genHost(node.children, data);
    },

    // //////////////////////////

    genNodeContentCommon(node) {
      return [
        this.genChildrenHost(node)
      ];
    },

    genNodeContentTypography(node) {
      const nodeInfo = this.getNodeInfo(node.id);

      return (
        <VSheet class="d-flex align-center">
          <VSheet width="40px" height="40" class="d-flex align-center justify-center">
            <VIcon>{nodeInfo.icon}</VIcon>
          </VSheet>
          <VDivider vertical class="mr-1"/>
          <VSpacer>
            {this.genChildrenHost(node)}
          </VSpacer>
        </VSheet>
      );
    },

    genNodeContentAttribute(node) {
      const nodeInfo = this.getNodeInfo(node.id);

      return (
        <VSheet class="d-flex align-center">
          <VSheet width="32px" height="32" class="d-flex align-center justify-center">
            <VIcon size={18}>{nodeInfo.icon}</VIcon>
          </VSheet>
          <VDivider vertical class="mr-3"/>
          <div class="text-caption font-weight-medium">{nodeInfo.name}</div>
        </VSheet>
      );
    },

    genNodeContentRow(node) {
      return [
        this.genChildrenHost(node)
      ];
    },

    // //////////////////////////

    genNode(node) {
      const blockType = this.getBlockType(node.id);

      const generator = this[`genNodeContent${pascalCase(blockType)}`]
        ? this[`genNodeContent${pascalCase(blockType)}`]
        : this.genNodeContentBlock;

      const content = wrapInArray(generator(node));

      const classList = {
        'schema-composer__node': true,
        'schema-composer__node--active': this.activeNode === node.uid,
        [`schema-composer__node--${blockType}`]: true
      };

      return (
        <div
          class={classList}
          ref={`node-${node.uid}`}
          vOn:click_stop={() => {
            this.selectNode(node.uid);
          }}
          vOn:mouseover_stop={() => {
            this.hoverNode(node.uid);
          }}
          vOn:mouseleave_stop={() => {
            this.hoverNode(null);
          }}
        >{content}</div>
      );
    },

    genHoverBox() {
      return (
        <div
          class="schema-composer__hover-box"
          style={this.hoverBox.styles}
          ref="hover-box"
        />
      );
    },
    genFocusBox() {
      return (
        <div
          class="schema-composer__focus-box"
          style={this.focusBox.styles}
          ref="focus-box"
        />
      );
    }
  },

  render() {
    const composer = this.genHost(
      this.internalSchema,
      {
        class: ['schema-composer__host']
      }
    );

    return (
      <div class="schema-composer">
        {this.genHoverBox()}
        {this.genFocusBox()}
        {composer}
      </div>
    );
  }
};

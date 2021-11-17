import './vls-builder-canvas.scss';

/* eslint-disable */
import {
  VIcon, VSheet, VDivider, VSpacer, VBtn
} from 'vuetify/lib/components';

import {
  ClickOutside
} from 'vuetify/lib/directives';

/* eslint-enable */

import {
  pascalCase,
  deepFindParentByValue
} from '@deip/toolbox';

import draggable from 'vuedraggable';

import { BuilderMixin } from '../../mixins';

export const VlsBuilderCanvas = {
  name: 'VlsBuilderCanvas',

  mixins: [BuilderMixin],

  directives: {
    ClickOutside
  },

  data() {
    return {
      hoverBox: {},
      focusBox: {},

      isMoved: false
    };
  },

  methods: {

    getBlockType(id) {
      const { blockType = 'common' } = this.getContainerNodeInfo(id);
      return blockType;
    },

    getNodeBoxData(uid) {
      if (!uid) return false;

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

    hoverNode(uid) {
      if (!uid || this.isMoved) {
        this.hoverBox = {};
      } else {
        this.hoverBox = this.getNodeBoxData(uid);
      }
    },

    selectNode() {
      this.hoverNode(null);

      if (!this.containerActiveNode) {
        this.focusBox = {};
      } else {
        this.focusBox = this.getNodeBoxData(this.containerActiveNode);
      }
    },

    genHost(
      additionData = {},
      list
    ) {
      const reset = () => {
        this.isMoved = true;
        this.setContainerActiveNode(null);
      };

      const data = {
        props: {
          list
        },
        attrs: {
          group: { name: 'blocks' }
        },
        on: {
          clone: reset,
          start: reset,
          end: () => {
            this.isMoved = false;
          }
        },
        ...additionData
      };

      return (
        <draggable {...data }>
          {this.genNodes(list)}
        </draggable>
      );
    },

    genChildrenHost(node) {
      if (!node?.children) return [];

      const data = {
        class: [
          'vls-builder-canvas__node-host',
          `vls-builder-canvas__node-host--${this.getBlockType(node.id)}`
        ]
      };

      return this.genHost(data, node.children);
    },

    // //////////////////////////

    genNodeContentCommon(node) {
      return this.genChildrenHost(node);
    },

    genNodeContentTypography(node) {
      const nodeInfo = this.getContainerNodeInfo(node.id);

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

    genNodeContentSimple(node) {
      const nodeInfo = this.getContainerNodeInfo(node.id);

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

    genNodeContentAttribute(node) {
      return this.genNodeContentSimple(node);
    },

    genNodeContentRow(node) {
      return this.genChildrenHost(node);
    },

    // //////////////////////////

    genNodes(nodes) {
      return nodes.map((node) => {
        const blockType = this.getBlockType(node.id);

        const generator = this[`genNodeContent${pascalCase(blockType)}`]
          ? this[`genNodeContent${pascalCase(blockType)}`]
          : this.genNodeContentCommon;

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
          >{generator(node)}</div>
        );
      });
    },

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
    }
  },

  render() {
    const composer = this.genHost({
      class: ['vls-builder-canvas__host']
    }, this.schemaAcc);

    return (
      <div class="vls-builder-canvas">
        <div
          class="vls-builder-canvas__pane"
          vClickOutside={{
            handler: () => {
              this.setContainerActiveNode(null);
            },
            include: () => [document.querySelector('.vls-builder-tree')].filter((el) => el)
          }}
        >
          {this.genHoverBox()}
          {this.genFocusBox()}
          {composer}
        </div>
        <pre>{JSON.stringify(this.schemaAcc, null, 2)}</pre>
      </div>
    );
  }
};

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
  wrapInArray,
  pascalCase,
  deepFindParentByValue,
  objectPath
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

      const { id } = deepFindParentByValue(this.containerSchema, uid);

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
      target = null
    ) {
      const nodes = objectPath.get(this.containerSchema, target);

      const data = {
        props: {
          value: nodes
        },
        attrs: {
          group: { name: 'blocks' }
        },
        on: {
          input: (val) => {
            if (target) {
              const updated = this.containerSchema;
              objectPath.set(updated, target, val);
              this.updateContainerSchema(updated);
            } else {
              this.updateContainerSchema(val);
            }
          },
          start: () => {
            this.isMoved = true;
            this.setContainerActiveNode(null);
          },
          end: () => {
            this.isMoved = false;
          }
        },
        ...additionData
      };

      return (
        <draggable {...data }>
          {this.genNodes(nodes)}
        </draggable>
      );
    },

    genChildrenHost(node) {
      if (!node?.children) return [];

      const { path: nodePath } = deepFindParentByValue(this.containerSchema, node.uid, true);

      const data = {
        class: [
          'schema-composer__node-host',
          `schema-composer__node-host--${this.getBlockType(node.id)}`
        ]
      };

      return this.genHost(data, [...nodePath, 'children']);
    },

    // //////////////////////////

    genNodeContentCommon(node) {
      return [
        this.genChildrenHost(node)
      ];
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
      return [
        this.genChildrenHost(node)
      ];
    },

    // //////////////////////////

    genNodes(nodes) {
      return nodes.map((node) => {
        const blockType = this.getBlockType(node.id);

        const generator = this[`genNodeContent${pascalCase(blockType)}`]
          ? this[`genNodeContent${pascalCase(blockType)}`]
          : this.genNodeContentCommon();

        const content = wrapInArray(generator(node));

        const classList = {
          'schema-composer__node': true,
          'schema-composer__node--active': this.containerActiveNode === node.uid,
          [`schema-composer__node--${blockType}`]: true
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
          >{content}</div>
        );
      });
    },

    genHoverBox() {
      return (
        <div
          class="schema-composer__hover-box"
          style={this.hoverBox?.styles || {}}
          ref="hover-box"
        >
          <div class="schema-composer__hover-box-header">
            <div class="schema-composer__box-label">
              {this.hoverBox?.info?.name}
            </div>
          </div>
        </div>
      );
    },
    genFocusBox() {
      return (
        <div
          class="schema-composer__focus-box"
          style={this.focusBox?.styles || {}}
          ref="focus-box"
        >
          <div class="schema-composer__focus-box-header">
            <div class="schema-composer__box-label">
              {this.focusBox?.info?.name}
            </div>
            <VBtn
              icon
              width={16}
              height={16}
              class="mr-n1 mt-n1 mb-n1"
              color="white"
              onClick={() => {
                this.removeNode(this.focusBox?.uid);
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
      class: ['schema-composer__host']
    });
    return (
      <div
        class="schema-composer"
      >
        {this.genHoverBox()}
        {this.genFocusBox()}
        {composer}
      </div>
    );
  }
};

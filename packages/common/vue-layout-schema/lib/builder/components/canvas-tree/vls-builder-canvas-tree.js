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
import { BuilderMixin } from '../../mixins';

export const VlsBuilderCanvasTree = {
  name: 'VlsBuilderCanvasTree',

  mixins: [BuilderMixin],

  data() {
    return {
      toggleMap: {}
    };
  },

  methods: {
    genNode(item, level = 0) {
      const { icon, name } = this.getContainerNodeInfo(item.id);
      const { uid, children } = item;
      const active = !!this.toggleMap[uid];

      const toggleNode = (e) => {
        e.stopPropagation();
        this.$set(this.toggleMap, uid, !active);
      };

      const nodeShift = (child = null) => (
        <VSheet
          class="d-flex justify-center"
          color="transparent"
          width={18}
          height={18}
        >
          {child}
        </VSheet>
      );

      const nodeToggle = (
        <VBtn
          icon
          width={18}
          height={18}
          onClick={toggleNode}
        >
          <VIcon size={16}>
            {active ? 'mdi-chevron-down' : 'mdi-chevron-right'}
          </VIcon>
        </VBtn>
      );

      const head = (
        <VSheet
          class="d-flex"
          color={this.containerActiveNode === uid ? 'primary lighten-4' : 'transparent'}
          onClick={() => this.setContainerActiveNode(uid)}
        >
          {new Array(level).fill(nodeShift(<VDivider vertical />))}
          {nodeShift(children?.length ? nodeToggle : '')}
          <VIcon size={16} class="mr-2">{icon}</VIcon>
          <VSpacer class="text-caption">{name}</VSpacer>
        </VSheet>
      );

      return (
        <div>
          {head}
          {children ? this.genDragger(children, level + 1, active) : null}
        </div>
      );
    },

    genDragger(list, level = 0, visible = true) {
      const data = {
        props: { list },
        class: {
          'd-none': !visible
        },
        attrs: {
          group: { name: 'blocksTree' }
        },
        on: {
          start: () => {
            this.setContainerActiveNode(null);
          }
        }
      };

      return (
        <draggable { ...data }>
          {list.map((el) => this.genNode(el, level))}
        </draggable>
      );
    }
  },

  render() {
    return (
      <div class="schema-tree">
        {this.genDragger(this.containerSchema)}
      </div>
    );
  }
};

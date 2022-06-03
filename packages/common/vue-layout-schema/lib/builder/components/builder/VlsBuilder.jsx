import {
  VListItemGroup,
  VListItem,
  VListItemContent,
  VListItemIcon,
  VIcon,
  VBtn
// eslint-disable-next-line import/no-unresolved,import/extensions
} from 'vuetify/lib/components';

import { isEqual } from 'lodash';

import { VlsBuilderContainer } from '../container';
import { VlsBuilderBlocks } from '../blocks';
import { VlsBuilderTree } from '../tree';
import { VlsBuilderCanvas } from '../canvas';
import { VlsBuilderSettings } from '../settings';

/**
 * Schema builder
 */
export default {
  name: 'VlsBuilder',

  props: {
    /**
     * Schema value
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * Schema blocks
     */
    blocks: {
      type: Array,
      default: () => []
    },
    /**
     * Is builder disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Is builder loading
     */
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeControls: 'blocks',
      schema: this.value
    };
  },

  watch: {
    value: {
      handler(newVal) {
        if (newVal && !isEqual(newVal, this.schema)) {
          this.schema = newVal;
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    /**
     * Handle "Save" button click
     */
    handleSaveBtnClick() {
      /**
       * Submit event
       */
      this.$emit('submit', this.schema);
    }
  },

  render() {
    return (
      <VlsBuilderContainer
        vModel={this.schema}
        blocks={this.blocks}
        class="vls-builder"
      >
        <div class="vls-builder__toggle">
          {this.$slots.toggle}

          <VListItemGroup
            vModel={this.activeControls}
            color="primary"
          >
            <VListItem value="blocks" class="pl-4">
              <VListItemIcon>
                <VIcon>mdi-plus-box</VIcon>
              </VListItemIcon>
              <VListItemContent/>
            </VListItem>

            <VListItem value="tree" class="pl-4">
              <VListItemIcon>
                <VIcon>mdi-file-tree-outline</VIcon>
              </VListItemIcon>
              <VListItemContent/>
            </VListItem>
          </VListItemGroup>
        </div>

        <div class="vls-builder__controls">
          {this.$slots.controls}

          <div class="vls-builder__column">
            <div class="vls-builder__column-head text-h6">
              {this.activeControls === 'blocks' ? 'Add' : null}
              {this.activeControls === 'tree' ? 'Navigate' : null}
            </div>
            <div class={{
              'vls-builder__column-content': true,
              'pa-0': true,
              'py-3': this.activeControls === 'tree'
            }}>
              {this.activeControls === 'blocks' ? <VlsBuilderBlocks/> : null}
              {this.activeControls === 'tree' ? <VlsBuilderTree/> : null}
            </div>
          </div>
        </div>

        <div class="vls-builder__content">
          <div class="vls-builder__column vls-builder__column--no-head">
            <div class="vls-builder__column-content">
              {this.$slots.default}

              <VlsBuilderCanvas/>

              {this.$slots.append}
            </div>
          </div>
        </div>

        <div class="vls-builder__settings">
          <div class="vls-builder__column">
            <div class="vls-builder__column-head text-h6">
              Settings
            </div>
            <div class="vls-builder__column-content pb-24" style="padding-bottom: 104px">
              {this.$slots.settings}
              <VlsBuilderSettings/>
            </div>
          </div>
        </div>

        <VBtn
          color="primary"
          absolute
          bottom
          right
          fab
          style={{
            right: '24px',
            bottom: '24px'
          }}
          disabled={this.disabled}
          loading={this.loading}
          onClick={this.handleSaveBtnClick}
        >
          <VIcon>mdi-content-save-outline</VIcon>
        </VBtn>
      </VlsBuilderContainer>
    );
  }
};

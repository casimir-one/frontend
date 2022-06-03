<template>
  <v-treeview
    v-bind="treeviewProps"
    :value="internalValue"
    :active="activeItems"

    :return-object="false"

    :class="{'v-treeview--without-children': oneLevelItems}"

    @input="handleInput"
    @update:active="handleActivate"
  />
</template>
<script>
  import { defineComponent } from '@deip/platform-util';
  import { find as deepFind } from 'find-keypath';
  /* eslint-disable */
  import { VTreeview } from 'vuetify/lib';
  /* eslint-enable */
  import { isNil, get, difference } from 'lodash';

  import { getBindableProps } from '../../composables';
  /**
   * Component for displaying large amounts of nested data
   */
  export default defineComponent({
    name: 'VexTreeview',
    components: { VTreeview },

    props: {
      ...VTreeview.options.props,
      /**
       * Autoselect Parents.
       * Works only with "independent" selection type
       * (selection-type: independent)
       */
      autoselectParents: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        internalValue: [],
        activeItems: [],
        oldValue: []
      };
    },

    computed: {
      treeviewProps() {
        return getBindableProps.call(this, VTreeview.options.props);
      },
      oneLevelItems() {
        return !this.items
          .filter((node) => (node.children && node.children.length))
          .length;
      }
    },

    watch: {
      value: {
        handler() {
          this.internalValue = [...this.value];
        },
        immediate: true
      },
      internalValue: {
        handler() {
          if (this.activatable) {
            this.activeItems = [...this.internalValue];
          }
        },
        immediate: true
      }
    },

    created() {
      this.oldValue = [...this.value];
    },

    methods: {
      /**
       * Input field handler
       * Allows you to select elements depending on the specified type
       * @param {Array} value selected items
       */
      handleInput(value) {
        if (this.selectionType === 'independent' && this.autoselectParents) {
          const removed = this.oldValue.length > value.length;
          const changedId = (removed
            ? difference(this.oldValue, value)
            : difference(value, this.oldValue)
          )[0];
          if (isNil(changedId)) return;

          if (removed) {
            this.removeChildren(changedId);
          } else {
            this.addParents(changedId);
          }

          this.oldValue = [...this.internalValue];
        } else {
          this.internalValue = [...value];
        }
        /**
         * Send input value event
         * @property {Array} internalValue selected items
         * @event input
         */
        this.$emit('input', this.internalValue);
      },
      /**
       * Allows user to mark a node as active by clicking on it
       * @param {Array} value selected items
       */
      handleActivate(value) {
        if (this.activatable) {
          this.handleInput(value);
        }
      },
      /**
       * Remove children
       * @param {string} id
       */
      removeChildren(id) {
        const target = this.getItemObject(id);
        this.removeItem(target[this.itemKey]);

        if (target.children && target.children.length) {
          for (const child of target.children) {
            this.removeChildren(child[this.itemKey]);
          }
        }
      },
      /**
       * Add selected units to another parent category
       * @param {string} id id of new parent
       */
      addParents(id) {
        const path = this.getItemPath(id);
        let target = this.items;

        for (const value of path) {
          target = target[value];
          if (!isNil(target[this.itemKey])) {
            this.addItem(target[this.itemKey]);
          }
        }
      },
      /**
       * Сompute path to category base
       * @param {string} id
       */
      getItemPath(id) {
        const path = deepFind(this.items, id);
        path.pop();
        return path;
      },
      /**
       * Get all nested children of a category
       * @param {string} id
       */
      getItemObject(id) {
        return get(this.items, this.getItemPath(id));
      },
      /**
       * Remove item/leaf
       * @param {string} id id of item
       */
      removeItem(id) {
        const idx = this.internalValue.indexOf(id);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      },
      /**
       * Add new item/leaf
       * @param {string} id id of item
       */
      addItem(id) {
        this.internalValue.push(id);
        this.internalValue = [...new Set(this.internalValue)];
      }
    }
  });
</script>

<style lang="scss">
  .v-application {
    .v-treeview {
      &--without-children {
        .v-treeview-node__level {
          display: none;
        }
      }

      &-node__checkbox {
        margin-right: 16px;
      }

      &--hoverable {
        .v-treeview-node__root {
          cursor: pointer;
        }
      }
    }
  }
</style>

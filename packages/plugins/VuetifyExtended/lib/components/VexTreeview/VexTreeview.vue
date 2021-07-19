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
  import { defineComponent } from '@deip/platform-fns';
  import { find as deepFind } from 'find-keypath';
  /* eslint-disable */
  import { VTreeview } from 'vuetify/lib';
  /* eslint-enable */
  import { isNil, get, difference } from 'lodash/fp';

  import { getBindableProps } from '../../composables/props';

  export default defineComponent({
    name: 'VexTreeview',
    components: { VTreeview },

    props: {
      ...VTreeview.options.props,
      autoselectParents: { // works only with independent selection type
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

        this.$emit('input', this.internalValue);
      },

      handleActivate(value) {
        if (this.activatable) {
          this.handleInput(value);
        }
      },

      removeChildren(id) {
        const target = this.getItemObject(id);
        this.removeItem(target.id);

        if (target.children && target.children.length) {
          for (const child of target.children) {
            this.removeChildren(child.id);
          }
        }
      },

      addParents(id) {
        const path = this.getItemPath(id);
        let target = this.items;

        for (const value of path) {
          target = target[value];
          if (!isNil(target.id)) {
            this.addItem(target.id);
          }
        }
      },

      getItemPath(id) {
        const path = deepFind(this.items, id);
        path.pop();
        return path;
      },

      getItemObject(id) {
        return get(this.getItemPath(id), this.items);
      },

      removeItem(id) {
        const idx = this.internalValue.indexOf(id);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      },

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

<template>
  <v-sheet>
    <v-menu
      v-model="open"
      :close-on-content-click="false"
      offset-y
      offset-overflow
      max-height="300"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="search"
          :label="label"
          hide-details="auto"
          :error-messages="errors"
          :disabled="disabled"
          autocomplete="off"
          :append-icon="'mdi-menu-down'"
          :class="{'icon-upended': open}"

          v-bind="attrs"
          v-on="on"
        />
      </template>

      <v-sheet class="py-2">
        <vex-treeview
          v-if="domainsTree && domainsTree.length"
          :items="domainsTree"
          :value="internalValue"
          item-key="_id"
          item-text="name"

          :search="search"

          hoverable

          activatable
          multiple-active

          selectable
          selection-type="independent"
          autoselect-parents
          @input="handleInput"
        />
      </v-sheet>
    </v-menu>

    <div
      v-if="selectedDomains && selectedDomains.length"
      class="pt-2 ma-n1"
    >
      <v-chip
        v-for="domain in selectedDomains"
        :key="domain._id"
        class="ma-1"
        :disabled="disabled"
      >
        <div class="text-truncate">
          {{ domain.name }}
        </div>
        <v-btn
          icon
          x-small
          class="mr-n2 ml-2"
          @click="removeItem(domain._id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-chip>
    </div>
  </v-sheet>
</template>

<script>
  import { VexTreeview } from '@deip/vuetify-extended';
  /**
   * Сomponent - selector to select different domains
   */
  export default {
    name: 'DomainSelector',
    components: { VexTreeview },

    props: {
      /**
       * Allows one to control which nodes are selected.
       * The array consists of the item-key of each selected item.
       */
      value: {
        type: Array,
        default: () => []
      },
      /**
       * Label content
       */
      label: {
        type: String,
        default: null
      },
      /**
       * Disables selection for all nodes
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Errors
       */
      errors: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        internalValue: [],
        search: '',
        open: false
      };
    },

    computed: {
      domainsTree() {
        return this.$store.getters['domains/tree']();
      },
      selectedDomains() {
        return this.$store.getters['domains/list']({ _id: this.internalValue });
      }
    },

    watch: {
      value: {
        handler() {
          this.internalValue = [...this.value];
        },
        immediate: true
      }
    },

    methods: {
      /**
       * Remove item of domain
       * @property {String} item id
       */
      removeItem(id) {
        const idx = this.internalValue.indexOf(id);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.handleInput(this.internalValue);
        }
      },
      /**
       * Handle input values
       * Emits the array of selected items when this value changes
       * @property {Array} selected items
       */
      handleInput(value) {
        this.internalValue = [...value];
        /**
         * Input event
         * Fires when a new value is entered
         * @property {Array} value - selected items
         * @event input
         */
        this.$emit('input', value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .icon-upended {
    ::v-deep .v-input__icon--append{
      .v-icon {
        transform: rotate(180deg);
      }
    }
  }
</style>

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

          outlined
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
        outlined
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

  export default {
    name: 'DomainSelector',
    components: { VexTreeview },

    props: {
      value: {
        type: Array,
        default: () => []
      },
      label: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
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
      removeItem(id) {
        const idx = this.internalValue.indexOf(id);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.handleInput(this.internalValue);
        }
      },
      handleInput(value) {
        this.internalValue = [...value];
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

<template>
  <vex-section>
    <ve-stack :gap="24">
      <vex-section-title
        title="Attributes"
        class="align-center"
      >
        <template #append>
          <v-btn
            small
            color="primary"
            outlined
            class="mr-4"
            :to="{ name: 'admin.attributes.settings' }"
          >
            <v-icon left>
              mdi-tune-vertical
            </v-icon>
            Settings
          </v-btn>
          <v-btn
            small
            color="primary"
            depressed
            :to="{ name: 'admin.attributes.create' }"
          >
            <v-icon left>
              mdi-puzzle-plus-outline
            </v-icon>
            New attribute
          </v-btn>
        </template>
      </vex-section-title>
      <attributes-list
        :on-click-edit="onClickEdit"
        :on-click-remove="onClickRemove"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { AttributesList } from '@deip/attributes-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  export default {
    name: 'AdminAttributes',
    components: {
      AttributesList,
      VeStack,
      VexSection,
      VexSectionTitle
    },
    methods: {
      onClickEdit({ _id }) {
        this.$router.push({
          name: 'admin.attributes.edit',
          params: {
            attributeId: _id
          }
        });
      },

      isAttributeInSettings(attributeId) {
        return this.$store.getters['attributes/settings']?.map?.find((setting) => setting.value === attributeId);
      },

      async onClickRemove(attributeId) {
        const message = this.isAttributeInSettings(attributeId)
          ? 'Attribute is used in Settings map. Are you sure you want to remove it?'
          : 'Are you sure you want to remove attribute?';
        try {
          const isConfirmed = await this.$confirm(message, { title: 'Remove attribute' });
          if (!isConfirmed) return;
          await this.$store.dispatch('attributes/remove', attributeId);
          this.$notifier.showSuccess('Attribute removed successfully!');
        } catch (error) {
          console.error(error);
          this.$notifier.showError('Something wrong!');
        }
      }
    }
  };
</script>

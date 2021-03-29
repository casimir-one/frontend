<template>
  <vex-stack gap="4">
    <div
      v-for="(item, index) of attribute.value"
      :key="index"
      class="text-body-2"
    >
      <template v-if="item.url">
        <v-hover v-slot="{ hover }">
          <a
            :href="item.url"
            target="_blank"
            class="text-decoration-none d-flex"
            :class="{ 'text--primary': !hover }"
          >
            <v-icon left size="20" :color="hover ? 'primary' : 'black'">
              mdi-launch
            </v-icon>
            {{ item.label || item.url }}
          </a>
        </v-hover>
      </template>

      <template v-if="!item.url">
        <span class="">{{ item.label }}</span>
      </template>
    </div>
  </vex-stack>
</template>

<script>
  import { VexStack } from '@deip/vuetify-extended';
  import { attributeRead } from '../../mixins/base';

  export default {
    name: 'AttributeUrlRead',
    components: { VexStack },
    mixins: [attributeRead]
  };
</script>

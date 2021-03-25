<template>
  <v-row>
    <v-col cols="8">
      <v-text-field
        v-model="internalValue.title"
        :label="`${fieldLabelKey} name`"
        hide-details="auto"
        outlined
      />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="internalValue.shortTitle"
        :label="`${fieldLabelKey} short name`"
        hide-details="auto"
        outlined
      />
    </v-col>
    <v-col cols="12">
      <v-textarea
        v-model="internalValue.description"
        :label="`${fieldLabelKey} description`"
        hide-details="auto"
        outlined
        auto-grow
        :rows="3"
      />
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AttributeEditMeta',
    mixins: [Proxyable],
    props: {
      fieldLabelKey: {
        type: String,
        default: 'Attribute' 
      }
    }
  };
</script>

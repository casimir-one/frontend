<template>
  <v-sheet class="d-flex">
    <v-sheet width="256" class="pa-6">blocks</v-sheet>
    <v-divider vertical class="ma-0" />
    <v-sheet class="spacer pa-6">

      <v-item-group v-model="selectedBlock" v-click-outside="() => {selectedBlock = undefined}">
        <v-row>
          <v-col
            v-for="n in 3"
            :key="n"
            cols="4"
          >

            <v-item v-slot="{ active, toggle }" :value="`block-${n}`" >
              <div @click="toggle">
                <v-card :outlined="active" class="pa-12">
                  {{ n }}
                </v-card>
              </div>
            </v-item>

          </v-col>
        </v-row>
      </v-item-group>

    </v-sheet>
    <v-divider vertical class="ma-0" />
    <v-sheet width="256" class="pa-6">
      settings<br>
      selected: {{selectedBlock}}
    </v-sheet>
  </v-sheet>
</template>

<script>
  import {
    VSheet
  } from 'vuetify/lib/components';

  export default {
    name: 'SchemaBuilder',
    components: {
      VSheet
    },
    data() {
      return {
        selectedBlock: undefined
      }
    }
  }
</script>

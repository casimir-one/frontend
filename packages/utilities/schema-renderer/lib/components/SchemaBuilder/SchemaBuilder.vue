<template>
  <v-sheet class="d-flex">
    <v-sheet width="256" class="pa-6">
      <schema-blocks-list :blocks="blocks"/>
    </v-sheet>

    <v-divider vertical class="ma-0"/>
    <v-sheet class="spacer pa-6">
      Selected uid: {{ selectedNode }}
      <schema-composer
        v-model="schema"
        :blocks="blocks"
        @select-node="onSelectNode"
      />



      <pre class="overflow-auto">{{ JSON.stringify(schema, null, 2) }}</pre>


    </v-sheet>
    <v-divider vertical class="ma-0"/>
    <v-sheet width="256" class="pa-6">
      settings<br>
    </v-sheet>
  </v-sheet>
</template>

<script>
  import {
    VSheet
  } from 'vuetify/lib/components';
  import SchemaBlocksList from '../SchemaBlocksList/SchemaBlocksList';
  import { SchemaComposer } from '../SchemaComposer/SchemaComposer';

  export default {
    name: 'SchemaBuilder',
    components: {
      SchemaComposer,
      SchemaBlocksList,
      VSheet
    },
    data() {
      return {
        selectedNode: undefined,

        schema: [],

        blocks: [
          {
            title: 'One',
            blocks: [
              {
                name: 'row',
                is: 'div',
                type: 'row',
                children: [
                  {
                    name: 'col',
                    is: 'div',
                    children: [],
                    saltero: 'dddddd',
                    data: {
                      props: { foo: 'bar' }
                    }
                  }
                ]
              },
              {
                name: 'col',
                is: 'div',
                children: [],
                saltero: 'dddddd',
                data: {
                  props: { foo: 'bar' }
                }
              }
            ]
          },
          {
            title: 'Two',
            blocks: new Array(4).fill(null)
              .map((x, index) => ({
                name: `bl-2${index}`,
                is: 'div'
              }))
          }
        ]
      }
    },
    methods: {
      onSelectNode(e) {
        this.selectedNode = e;
      }
    }
  }
</script>

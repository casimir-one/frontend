<template>
  <v-sheet>

    <v-sheet
      v-for="(section, index) of normalizedBlocks"
      :key="`list-${index}`"
      class="mb-6"
    >

      <div class="text-overline mb-3">
        {{ section.title }}
      </div>

      <draggable
        :key="`drg-${index}`"
        :list="section.blocks"
        :group="{ name: 'blocks', pull: 'clone', put: false }"
        draggable=".xxx"
        :sort="false"
        :clone="onClone"
        :class="$style.list"
      >
        <v-hover
          v-for="block of section.blocks"
          :key="block.id"
          v-slot="{ hover }"
        >
          <v-sheet
            class="text-center pa-2 pos-relative xxx"
            :color="`grey ${hover ? 'lighten-3' : 'lighten-4'}`"
            rounded
            style="cursor: move"
          >

<!--            <v-icon>{{ module.icon }}</v-icon>-->
            <div
              class="text-caption text--secondary mt-1 text-truncate"
              style="line-height: 16px"
            >
              {{ block.name }}
            </div>
          </v-sheet>
        </v-hover>
      </draggable>
    </v-sheet>

  </v-sheet>
</template>

<script>
  import draggable from 'vuedraggable';
  import { clearBlock, normalizeBlocksObject } from '../../utils/helpers';

  export default {
    name: 'SchemaBlocksList',
    components: {
      draggable
    },
    props: {
      blocks: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      normalizedBlocks() { return normalizeBlocksObject(this.blocks) }
    },
    methods: {
      onClone(block) {
        return clearBlock(block)
      },
    }
  }
</script>

<style lang="scss" module>
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--vex-grid-item-max-width, 100px), 1fr));
    grid-gap: .5rem;
  }
</style>

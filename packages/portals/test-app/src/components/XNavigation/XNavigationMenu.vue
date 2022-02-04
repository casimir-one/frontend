<template>
  <v-list nav dense>
    <template v-if="caption">
      <div class="text-overline text--secondary">
        {{ caption }}
      </div>
    </template>

    <v-list-item
      v-for="(item, index) of items"
      :key="index"

      :to="item.to"
      :input-value="activeRoute(item)"
    >
      <v-list-item-icon>
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    name: 'XNavigationMenu',
    props: {
      items: {
        type: Array,
        default: () => ([])
      },
      caption: {
        type: String,
        default: ''
      }
    },
    methods: {
      activeRoute(item) {
        if (!item.to) return false;

        const { route: { fullPath: itemPath } } = this.$router.resolve(item.to);
        const { route: { fullPath: targetPath } } = this.$router.resolve(this.$route);

        return new RegExp(`^${itemPath}`, 'i').test(targetPath);
      }
    }
  };
</script>

<style lang="scss">
  .core-menu {
    .theme--light {
      &.v-list-item {
        &::before {
          width: 84px;
        }

        &--active {
          &:hover::before, &::before {
            background: var(--v-primary-base);
            opacity: 1;
          }
        }
      }
    }
  }
</style>

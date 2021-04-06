<template>
  <v-btn
    small
    outlined
    :loading="loading"
    :disabled="loading"
    @click="toggleBookmark"
  >
    <v-icon left>
      {{ bookmarkId ? 'mdi-bookmark-minus' : 'mdi-bookmark-plus-outline' }}
    </v-icon>
    {{ bookmarkId ? 'Remove bookmark' : 'Add bookmark' }}
  </v-btn>
</template>

<script>
  export default {
    name: 'ToggleBookmarkBtn',

    data() {
      return {
        loading: false
      };
    },

    props: {
      type: {
        type: String,
        default: 'research'
      },
      refId: {
        type: String,
        required: true
      }
    },

    computed: {
      bookmarkId() {
        const bookmark = this.$store.getters['bookmarks/list']().find(
          (b) => b.ref === this.refId && b.type === this.type
        );

        return bookmark ? bookmark.id : false;
      }
    },

    methods: {
      updateBookmark() {
        return this.bookmarkId
          ? this.$store.dispatch('bookmarks/remove', this.bookmarkId)
          : this.$store.dispatch('bookmarks/add', this.refId);
      },

      toggleBookmark() {
        this.loading = true;

        return this.updateBookmark()
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

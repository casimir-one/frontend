<template>
  <layouts-management
    @click-remove="onClickRemove"
    @click-edit="onClickEdit"
    @click-create="onClickCreate"
    @click-settings="onClickSettings"
  />
</template>

<script>
  import { LayoutsManagement } from '@deip/layouts-module';

  export default {
    name: 'AdminLayouts',

    components: {
      LayoutsManagement
    },

    methods: {
      onClickRemove(item) {
        this.$confirm('This action can not be revert', { title: 'Delete layout' })
          .then((confirm) => {
            if (confirm) {
              this.$store.dispatch('layouts/remove', item)
                .then(() => {
                  this.$notifier.showSuccess('Layout removed');
                })
                .catch((err) => {
                  console.error(err);
                  this.$notifier.showError('Something wrong');
                });
            }
          });
      },

      onClickEdit({ _id }) {
        this.$router.push({
          name: 'admin.layouts.edit',
          params: {
            layoutId: _id
          }
        });
      },

      onClickCreate() {
        this.$router.push({
          name: 'admin.layouts.create'
        });
      },

      onClickSettings() {
        this.$router.push({
          name: 'admin.layouts.settings'
        });
      }
    }
  };
</script>

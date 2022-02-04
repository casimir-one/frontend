<template>
  <v-sheet>
    <vex-section>
      <ve-stack :gap="32">
        <vex-section-title
          :title="$t('admin.users.title')"
        />

        <users-data-provider>
          <template #default="{ users }">
            <v-data-table
              :items="users"
              :headers="headers"

              :hide-default-footer="users.length < itemsPerPage"
              :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
              :items-per-page="itemsPerPage"
            >
              <template #item.fullName="{ item }">
                {{ $$userFullName(item) }}
              </template>

              <template #item.email="{ item }">
                {{ item.email }}
              </template>

              <template #item.createdAt="{ item }">
                {{ formatCreatedDate(item.createdAt) }}
              </template>
            </v-data-table>
          </template>
        </users-data-provider>
      </ve-stack>
    </vex-section>
  </v-sheet>
</template>

<script>
  import { compareAsc } from 'date-fns';
  import { UsersDataProvider, userHelpersMixin } from '@deip/users-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import { dateMixin } from '@deip/platform-components';

  export default {
    name: 'AdminUsers',

    components: {
      UsersDataProvider,
      VexSection,
      VexSectionTitle,
      VeStack
    },

    mixins: [dateMixin, userHelpersMixin],

    data() {
      return {
        headers: [
          {
            text: this.$t('admin.users.user.name'),
            value: 'fullName',
            sortable: false
          },
          {
            text: this.$t('admin.users.user.email'),
            value: 'email'
          },
          {
            text: this.$t('admin.users.user.id'),
            value: '_id'
          },
          {
            text: this.$t('admin.users.user.created'),
            value: 'createdAt',
            sort: (date1, date2) => compareAsc(this.$$parseISO(date1), this.$$parseISO(date2))
          }
        ],
        itemsPerPage: 50
      };
    },

    methods: {
      formatCreatedDate(date) {
        return this.$$formatDate(this.$$parseISO(date));
      }
    }
  };
</script>

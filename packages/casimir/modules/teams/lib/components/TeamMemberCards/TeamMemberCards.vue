<template>
  <v-container class="ml-0">
    <ve-auto-grid cols="1" cols-sm="2" cols-md="4">
      <v-card
        v-for="user in users"
        :key="user._id"
        style="word-break: break-word"
        outlined
        width="200"
      >
        <v-card-actions class="justify-end" style="height: 44px">
          <v-btn
            v-if="checkForTeamAdmin(user)"
            icon
            small
            class="text-left"
            :loading="checkLoadingButton(user)"
            @click="handleItemClick(user)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-divider />
        <v-list>
          <v-list-item class="pa-4">
            <user-avatar size="50" :user="user" />
          </v-list-item>
          <v-list-item>
            {{ $$userFullName(user) }}
          </v-list-item>
          <v-list-item>
            {{ user.email }}
          </v-list-item>
        </v-list>
      </v-card>
    </ve-auto-grid>
  </v-container>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VeAutoGrid } from '@deip/vue-elements';
  import { UserAvatar, userHelpersMixin } from '@deip/users-module';

  export default defineComponent({
    name: 'TeamMemberCards',

    components: { UserAvatar, VeAutoGrid },

    mixins: [userHelpersMixin],

    props: {
      users: {
        type: Array,
        default: () => []
      },

      teamId: {
        type: String,
        required: true
      },

      canEdit: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        chosenUser: '',
        loading: false
      };
    },

    methods: {
      async removeMember() {
        if (this.teamId) {
          this.loading = true;
          try {
            const payload = {
              initiator: this.$currentUser,
              member: this.chosenUser._id,
              teamId: this.teamId
            };
            await this.$store.dispatch('teams/removeTeamMember', payload);
            this.emitSuccess();
          } catch (error) {
            console.error(error);
            this.emitError(error);
          }
        }
        this.loading = false;
      },
      async handleItemClick(user) {
        this.dialog = true;
        this.chosenUser = user;
        const message = this.$t('module.teams.cards.confirmRemove.message', {
          user: this.$$userFullName(user)
        });
        const options = {
          title: this.$t('module.teams.cards.confirmRemove.title')
        };
        const isConfirmed = await this.$confirm(message, options);

        if (isConfirmed) {
          this.removeMember();
        }
      },
      checkLoadingButton(user) {
        return this.loading && user._id === this.chosenUser._id;
      },
      checkForTeamAdmin(user) {
        return this.canEdit && user._id !== this.$currentUser._id;
      },
      emitSuccess() {
        this.$emit('success');
      },

      emitError(error) {
        this.$emit('error', error);
      }
    }
  });
</script>

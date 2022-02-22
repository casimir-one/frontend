<template>
  <div class="text-center">
    <v-dialog v-model="show" scrollable max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          {{ $t("module.teams.modal.title") }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <users-selector
              v-model="invitedMember"
              :filter-items="filterMembers()"
            />
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click.stop="handleCloseClick">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="handleAddMemberClick">
            Invite
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { UsersSelector } from '@deip/users-module';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'TeamAddMemberModal',

    components: {
      UsersSelector
    },

    props: {
      value: Boolean,
      teamId: {
        type: String,
        required: true
      },
      teamMembers: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        invitedMember: ''
      };
    },

    computed: {
      show: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    },

    methods: {
      filterMembers() {
        const ids = this.teamMembers.map((a) => a._id);
        return {
          '!_id': ids
        };
      },
      async handleAddMemberClick() {
        if (this.teamId) {
          try {
            this.show = false;
            const payload = {
              initiator: this.$currentUser,
              member: this.invitedMember,
              teamId: this.teamId
            };
            await this.$store.dispatch('teams/addTeamMember', payload);
            this.emitSuccess();
          } catch (error) {
            console.error(error);
            this.emitError(error);
          }
        }
      },

      handleCloseClick() {
        this.show = false;
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

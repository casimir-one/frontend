<template>
  <div class="text-body-2">
    <div v-if="isGroupMember">
      {{ $t('module.reviews.vote.notMembers') }}
    </div>

    <div v-else-if="isAuthor">
      {{ $t('module.reviews.vote.notSuppOwnRev') }}
    </div>

    <div v-else-if="userHasVoted">
      {{ $t('module.reviews.vote.once') }}
    </div>
    <v-btn
      :disabled="(loading || disabled || userHasVoted ||
        isGroupMember || isAuthor)"
      block
      color="primary"
      small
      outlined
      class="mt-2 text-body-2"
      :loading="loading"
      @click="voteReview()"
    >
      {{ $t('module.reviews.vote.suppRev') }}
    </v-btn>
  </div>
</template>

<script>

  export default {
    name: 'ReviewVote',

    props: {
      teamId: {
        type: String,
        default: null
      },
      review: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        loading: false,
        disabled: false
      };
    },

    computed: {

      userHasVoted() {
        return this.review.votes.some((vote) => vote.upvoter === this.$currentUser.username);
      },
      isGroupMember() {
        return this.$currentUser.teams.includes(this.teamId);
      },
      isAuthor() {
        return this.review.author === this.$currentUser.username;
      }
    },

    methods: {
      async voteReview() {
        this.loading = true;
        // TODO:  change domain id
        const payload = {
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          data: {
            domainId: this.$currentUser.username,
            reviewId: this.review._id,
            weight: '100.00 %'
          }
        };
        try {
          const res = await this.$store.dispatch('reviews/upvoteReview', payload);
          this.emitSuccess(res._id);
        } catch (err) {
          this.emitError(err);
        } finally {
          this.loading = false;
          this.dialog = false;
        }
      },
      emitSuccess(id) {
        /**
         * Success event
         *
         * @property {string} id
         */
        this.$emit('success', id);
      },

      emitError(err) {
        console.error(err);
        /**
       * Triggers when error occurs
       *
       * @property {Error} err
       */
        this.$emit('error', err);
      }
    }
  };
</script>

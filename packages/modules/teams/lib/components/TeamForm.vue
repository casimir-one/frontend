<template>
  <v-form>
    create
  </v-form>
</template>

<script>
  import { TEAM_FORM_MODES } from '../variables';

  export default {
    name: 'TeamForm',
    props: {
      mode: {
        type: [String, Number],
        default: TEAM_FORM_MODES.CREATE,
        validation(value) {
          return TEAM_FORM_MODES.keys().indexOf(value) !== -1
        }
      }
    },
    data() {
      return {
        TEAM_FORM_MODES
      }
    }
  }
</script>

<template>
  <vex-stack :gutter="8" class="mb-7">
    <!-- new password -->

    <validation-provider
      v-slot="{ errors }"
      :name="passwordLabel"
      :rules="{
        required: true,
        minMax: { min: passwordMinLentgh, max: passwordMaxLentgh }}"
    >
      <vex-password-input
        v-model="password"
        :label="passwordLabel"
        :error-messages="errors"
        v-bind="fieldsProps"
        counter
      />
    </validation-provider>

    <!-- repeat new password -->

    <validation-provider
      v-slot="{ errors }"
      :name="repeatPasswordLabel"
      :rules="{
        required: true,
        minMax: { min: passwordMinLentgh, max: passwordMaxLentgh },
        sameAsPassword: { field: password },
      }"
    >
      <vex-password-input
        v-model="repeatePassword"
        :label="repeatPasswordLabel"
        :error-messages="errors"
        v-bind="fieldsProps"
        counter
      />
    </validation-provider>
  </vex-stack>
</template>
<script>
  import { VexStack } from '../../VexStack';
  import { VexPasswordInput } from '../VexPasswordInput';

  let unwatch;

  export default {
    name: 'VexPasswordRepeatInput',

    components: {
      VexStack,
      VexPasswordInput
    },

    props: {
      passwordLabel: {
        type: String,
        default: 'Password'
      },

      repeatPasswordLabel: {
        type: String,
        default: 'Repeat password'
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true
        })
      },

      passwordMinLentgh: {
        type: Number,
        default: 10
      },

      passwordMaxLentgh: {
        type: Number,
        default: 64
      }

    },

    data() {
      return {
        password: '',
        repeatePassword: ''
      };
    },

    mounted() {
      unwatch = this.$watch('password',
                            this.sendNewPasswordValue,
                            { immediate: true });
    },

    beforeDestroy() {
      unwatch();
    },

    methods: {
      sendNewPasswordValue(val) {
        this.$emit('passwordValue', val);
      }
    }

  };
</script>

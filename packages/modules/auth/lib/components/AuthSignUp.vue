<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(signUp)"
    >
      <input
        autocomplete="false"
        name="hidden"
        type="text"
        style="display:none;"
      >

      <slot v-bind="binds">
        <slot name="prepend" v-bind="binds" />

        <slot name="fields" v-bind="binds">
          <vex-stack :gutter="8" class="mb-7">
            <slot name="prepend-fields" v-bind="binds" />

            <validation-provider
              v-slot="{ errors }"
              :name="emailLabel"
              rules="required|email"
              :debounce="1000"
            >
              <v-text-field
                v-model="formModel.email"
                :label="emailLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              :name="passwordLabel"
              rules="required"
            >
              <vex-password-input
                v-model="formModel.password"
                :label="passwordLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
              />
            </validation-provider>

            <slot name="apend-fields" v-bind="binds" />
          </vex-stack>
        </slot>

        <slot name="submit" v-bind="binds">
          <vex-stack :gutter="24">
            <v-btn
              type="submit"
              color="primary"
              block
              depressed
              :disabled="invalid || loading || disabled"
              :loading="loading"
            >
              {{ submitLabel }}
            </v-btn>

            <div class="text-center">
              {{ $t('module.auth.haveAccountQuestion') }}
              <router-link
                :to="{
                  name: $store.getters['auth/settings'].signInRouteName
                }"
                class="font-weight-medium text-decoration-none"
              >
                {{ $t('module.auth.signIn') }}
              </router-link>
            </div>
          </vex-stack>
        </slot>

        <slot name="append" v-bind="binds" />
      </slot>
    </v-form>
  </validation-observer>
</template>

<script>
  import { VexStack, VexPasswordInput } from '@deip/vuetify-extended';
  import AuthSignIn from './AuthSignIn';

  export default {
    name: 'AuthSignUp',

    components: {
      VexStack,
      VexPasswordInput
    },

    props: {
      passwordLabel: {
        type: String,
        default() {
          return this.$t('module.auth.password');
        }
      },
      emailLabel: {
        type: String,
        default() {
          return this.$t('module.auth.email');
        }
      },
      submitLabel: {
        type: String,
        default() {
          return this.$t('module.auth.signUp');
        }
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true,
          autocomplete: 'new-password'
        })
      },

      autologin: {
        type: Boolean,
        default: true
      },

      roles: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        loading: false,
        disabled: false,

        formModel: {
          email: '',
          password: ''
        }
      };
    },

    computed: {
      binds() {
        return {
          formModel: this.formModel,
          signUp: this.signUp
        };
      }
    },

    methods: {
      setLoading(state) {
        this.loading = state;
        this.disabled = state;
      },

      emitSuccess(data) {
        this.setLoading(false);
        this.$emit('success', data);
      },

      emitError(error) {
        this.setLoading(false);
        this.$emit('error', error);
      },

      signUp() {
        this.setLoading(true);

        this.$store.dispatch('auth/signUp', { ...this.formModel, ...{ roles: this.roles } })
          .then((res) => {
            if (this.autologin) {
              AuthSignIn.methods.signIn.call(this);
            } else {
              this.emitSuccess(res);
            }
          })
          .catch((error) => {
            this.emitError(error.response?.data || error.message);
          });
      }
    }
  };
</script>

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
            <validation-provider
              v-slot="{ errors }"
              :name="usernameLabel"
              rules="required"
            >
              <v-text-field
                v-model="formModel.username"
                :label="usernameLabel"
                :error-messages="errors"
                v-bind="fieldsProps"
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              :name="emailLabel"
              rules="required"
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
          </vex-stack>
        </slot>

        <slot name="submit" v-bind="binds">
          <vex-stack :gutter="24">
            <v-btn
              type="submit"
              color="primary"
              block
              depressed
              :disabled="invalid || loading"
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

  export default {
    name: 'AuthSignUp',

    components: {
      VexStack,
      VexPasswordInput
    },

    props: {
      usernameLabel: {
        type: String,
        default() {
          return this.$t('module.auth.username');
        }
      },
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
      }
    },

    data() {
      return {
        loading: false,
        formModel: {
          username: '',
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
      signUp() {
        this.loading = true;

        this.$store.dispatch('auth/signUp', this.formModel)
          .then(() => {
            if (this.autologin) {
              this.$store.dispatch('auth/signIn', this.formModel)
                .then(() => {
                  this.$emit('success');
                })
                .catch((error) => {
                  this.$emit('error', error);
                });
            } else {
              this.$emit('success');
            }
          })
          .catch((error) => {
            this.$emit('error', error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

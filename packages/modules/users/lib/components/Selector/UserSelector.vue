<template>
  <users-data-provider v-bind="providerProps" ref="dataProvider">
    <template #default="{ users, disabled, loading, ready}">
      <vex-autocomplete
        ref="field"
        v-model="internalValue"

        v-bind="fieldProps"

        :label="label"
        :items="users"

        :item-text="userFullName"
        :item-value="userExternalId"

        :name="label"
        :loading="loading"
        :disabled="disabled || !ready"
      >
        <template #item="{ item }">
          <slot name="item">
            <v-list-item-avatar :size="24">
              <v-img :src="userAvatarSrc(item, 24)" />
            </v-list-item-avatar>
            <v-list-item-content class="text-body-2">
              {{ userFullName(item) }}
            </v-list-item-content>
          </slot>
        </template>

        <template #selection="{ item }">
          <slot name="selection">
            <v-chip
              v-if="multiple"
              :disabled="disabled"
              outlined
              class="ml-0 mr-2"
            >
              <v-avatar left class="mr-2 ml-n2">
                <img :src="userAvatarSrc(item, 24)" alt="">
              </v-avatar>

              <div class="text-truncate spacer">
                {{ userFullName(item) }}
              </div>

              <v-btn
                icon
                x-small
                width="22px"
                height="22px"
                class="mr-n2 ml-2"
                @click="$refs.field.onChipInput(item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-chip>

            <div v-else class="d-inline-flex mr-4 align-center" style="max-width: calc(100% - 80px)">
              <v-avatar size="24" class="mr-2">
                <img :src="userAvatarSrc(item, 24)" alt="">
              </v-avatar>
              <div class="text-truncate">
                {{ userFullName(item) }}
              </div>
            </div>
          </slot>
        </template>
      </vex-autocomplete>
    </template>
  </users-data-provider>

</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import {
    VAutocomplete
  } from 'vuetify/lib/components';

  import { wrapInArray, isArray, isString, hasValue } from '@deip/toolbox';
  import { userFullName, userAvatarSrc } from '@deip/platform-fns';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import UsersDataProvider from '../DataProvider/UsersDataProvider';

  export default {
    name: 'UserSelector',
    components: { UsersDataProvider },
    mixins: [
      Proxyable
    ],

    props: {
      ...VAutocomplete.options.props,
      ...UsersDataProvider.props,

      ...{
        label: {
          type: String,
          default: 'Select members'
        },
      }
    },

    computed: {
      providerProps() {
        return getBindableProps.call(this, UsersDataProvider.props);
      },

      fieldProps() {
        return {
          ...getBindableProps.call(this, VAutocomplete.options.props),
          ...{
            autocomplete: 'off',

            offsetY: true,
            offsetOverflow: true
          }

        };
      }
    },

    methods: {
      readUserData(user) {
        let _user = wrapInArray(user)[0];

        if (isString(_user)) {
          return this.$refs.dataProvider.usersList.find(u => u.username === _user);
        }  else {
          return _user;
        }
      },

      userAvatarSrc,

      userFullName(data) {
        if (!hasValue(data)) return false;
        return userFullName(this.readUserData(data));
      },

      userExternalId(data) {
        if (!hasValue(data)) return false;
        return this.readUserData(data).account.name;
      }
    }
  };
</script>

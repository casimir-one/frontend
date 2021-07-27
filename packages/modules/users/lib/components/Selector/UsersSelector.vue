<template>
  <users-data-provider v-bind="providerProps" ref="dataProvider">
    <template #default="{ users, disabled, loading, ready}">
      <vex-autocomplete
        ref="field"
        v-model="internalValue"

        v-bind="fieldProps"

        :label="label"
        :items="users"

        :item-text="$$userFullName"
        :item-value="userExternalId"

        :name="label"
        :loading="loading"
        :disabled="disabled || !ready"
      >
        <template #item="{ item }">
          <slot name="item">
            <user-avatar
              :user="item"
              :size="24"
              view-type="listItem"
              color="neutral lighten-5"
            />
            <v-list-item-content class="text-body-2">
              {{ $$userFullName(item) }}
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
              <user-avatar
                :user="item"
                :size="24"
                left
                class="mr-2 ml-n2"
              />
              <div class="text-truncate spacer">
                {{ $$userFullName(item) }}
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

            <div
              v-else
              class="d-inline-flex mr-4 align-center"
              style="max-width: calc(100% - 80px)"
            >
              <user-avatar
                :user="item"
                :size="24"
                class="mr-2"
              />
              <div class="text-truncate">
                {{ $$userFullName(item) }}
              </div>
            </div>
          </slot>
        </template>
      </vex-autocomplete>
    </template>
  </users-data-provider>
</template>

<script>
  /* eslint-disable import/extensions, import/no-unresolved */
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { VAutocomplete } from 'vuetify/lib/components';
  /* eslint-enable import/extensions, import/no-unresolved */

  import { hasValue } from '@deip/toolbox';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { VexAutocomplete } from '@deip/vuetify-extended';
  import UsersDataProvider from '../DataProvider/UsersDataProvider';
  import UserAvatar from '../Avatar/UserAvatar';
  import { userHelpersMixin } from '../../mixins';

  export default {
    name: 'UsersSelector',
    components: {
      UsersDataProvider,
      UserAvatar,
      VexAutocomplete
    },
    mixins: [
      Proxyable,
      userHelpersMixin
    ],

    props: {
      ...VAutocomplete.options.props,
      ...UsersDataProvider.props,

      ...{
        label: {
          type: String,
          default: 'Select members'
        }
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
      userExternalId(data) {
        if (!hasValue(data)) return false;
        return data.account.name;
      }
    }
  };
</script>

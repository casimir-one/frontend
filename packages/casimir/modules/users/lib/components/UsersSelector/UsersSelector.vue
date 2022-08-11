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
        item-value="_id"

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

  import { getBindableProps } from '@casimir/vuetify-extended/lib/composables/props';
  import { VexAutocomplete } from '@casimir/vuetify-extended';
  import { defineComponent } from '@casimir/platform-util';

  import { UsersDataProvider } from '../UsersDataProvider';
  import { UserAvatar } from '../UserAvatar';
  import { userHelpersMixin } from '../../mixins';

  export default defineComponent({
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
      ...UsersDataProvider.options.props,

      ...{
        /**
         * Label for user selector
         *
         * @example 'Select members'
         */
        label: {
          type: String,
          default: 'Select members'
        }
      }
    },

    computed: {
      /**
       * Get computed binding provider properties
       */
      providerProps() {
        return getBindableProps.call(this, UsersDataProvider.options.props);
      },

      /**
       * Get computed binding field properties
       */
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
    }
  });
</script>

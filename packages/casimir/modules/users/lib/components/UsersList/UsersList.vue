<template>
  <users-data-provider v-bind="providerProps" ref="dataProvider">
    <template #default="{ users }">
      <component
        :is="listComponent"
        :users="users"
        v-on="componentEvents"
      />
    </template>
  </users-data-provider>
</template>

<script>
  import { getBindableProps } from '@casimir.one/vuetify-extended/lib/composables/props';
  import { defineComponent, componentViewType } from '@casimir.one/platform-util';

  import { UsersDataProvider } from '../UsersDataProvider';
  import { UsersListStack } from '../UsersListStack';

  export default defineComponent({
    name: 'UsersList',
    components: {
      UsersDataProvider,
      UsersListStack
    },
    props: {
      ...UsersDataProvider.options.props,
      /**
       * Type of view
       *
       * @example 'stack'
       */
      viewType: {
        type: String,
        default: 'stack'
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
       * Get computed component name by view type
       */
      listComponent() {
        return componentViewType.call(this);
      },
      /**
       * Get computed component events
       */
      componentEvents() {
        return {
          ...(this.$listeners['click-item'] ? { 'click-item': this.onClickItem } : {})
        };
      }
    },

    methods: {
      onClickItem(e) {
        /**
         * Click handler
         *
         * @property {Event} e The received event
         */
        this.$emit('click-item', e);
      }
    }
  });
</script>

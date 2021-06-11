<template>
  <component
    :is="component"
    color="neutral lighten-5"
    v-bind="avatarProps"
  >
    <img v-if="src" :src="src" alt="avatar">
    <span
      v-else
      :class="[textClass, 'text--disabled']"
    >{{ text }}</span>
  </component>
</template>

<script>
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { VAvatar, VListItemAvatar } from 'vuetify/lib/components';

  import { isString } from '@deip/toolbox';

  import { getBindableProps } from '../../composables/props';

  export default {
    name: 'VexAvatar',
    props: {
      ...VAvatar.options.props,
      ...VListItemAvatar.options.props,

      src: {
        type: String,
        default: null
      },

      text: {
        type: String,
        default: null
      },

      viewType: {
        type: String,
        default: 'avatar'
      }
    },

    computed: {
      component() {
        if (this.viewType === 'listItem') {
          return VListItemAvatar;
        }

        return VAvatar;
      },

      avatarProps() {
        return getBindableProps.call(this, this.component.options.props);
      },

      sizeNumber() {
        if (isString(this.$props.size)) {
          return parseInt(this.$props.size.replace(/\D/g, ''), 10);
        }
        return this.$props.size;
      },

      textClass() {
        if (!this.sizeNumber || this.sizeNumber <= 40) {
          return 'text-caption';
        }
        if (this.sizeNumber <= 48) {
          return 'text-body-2';
        }
        return 'text-body-1';
      }
    }
  };
</script>

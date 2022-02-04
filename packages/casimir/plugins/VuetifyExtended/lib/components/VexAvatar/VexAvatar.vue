<template>
  <component
    :is="component"
    :style="avatarStyle"
    v-bind="avatarProps"
  >
    <img v-if="src" :src="src" alt="avatar">
    <v-icon
      v-else
      :style="iconStyles"
      :size="iconSize"
    >
      {{ fallbackIcon }}
    </v-icon>
  </component>
</template>

<script>
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { VAvatar, VListItemAvatar } from 'vuetify/lib/components';
  import { isString } from '@deip/toolbox';
  import { defineComponent } from '@deip/platform-util';
  import { getBindableProps } from '../../composables';

  export default defineComponent({
    name: 'VexAvatar',

    inject: {
      theme: {
        default: {
          isDark: false
        }
      }
    },

    props: {
      ...VAvatar.options.props,
      ...VListItemAvatar.options.props,

      src: {
        type: String,
        default: null
      },

      fallbackIcon: {
        type: String,
        default: 'mdi-account-circle-outline'
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
          return parseInt(this.$props.size.replace(/\D/g, ''));
        }
        return this.$props.size;
      },

      iconSize() {
        return this.sizeNumber * 0.6;
      },

      iconStyles() {
        return {
          color: this.theme.isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'
        };
      },

      avatarStyle() {
        return {
          backgroundColor: this.theme.isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'
        };
      }
    }
  });
</script>

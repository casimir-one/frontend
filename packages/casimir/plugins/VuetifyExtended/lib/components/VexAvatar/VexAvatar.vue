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
  import { isString } from '@casimir/toolbox';
  import { defineComponent } from '@casimir/platform-util';
  import { getBindableProps } from '../../composables';

  /**
   * Avatar
   * @see See [avatar](https://vuetifyjs.com/en/api/v-avatar/)
   * @see See [list item avatar](https://vuetifyjs.com/en/api/v-list-item-avatar/)
   */
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

      /** Avatar source */
      src: {
        type: String,
        default: null
      },

      /** Fallback icon if no image passed */
      fallbackIcon: {
        type: String,
        default: 'mdi-account-circle-outline'
      },

      /**
       * Component type
       * @values 'avatar', 'listItem'
       */
      viewType: {
        type: String,
        default: 'avatar'
      }
    },

    computed: {
      /** Component */
      component() {
        if (this.viewType === 'listItem') {
          return VListItemAvatar;
        }

        return VAvatar;
      },

      /** Component props */
      avatarProps() {
        return getBindableProps.call(this, this.component.options.props);
      },

      /** Size cast to number */
      sizeNumber() {
        if (isString(this.$props.size)) {
          return parseInt(this.$props.size.replace(/\D/g, ''));
        }
        return this.$props.size;
      },

      /** Icon size */
      iconSize() {
        return this.sizeNumber * 0.6;
      },

      /** Icon styles */
      iconStyles() {
        return {
          color: this.theme.isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'
        };
      },

      /** Avatar styles */
      avatarStyle() {
        return {
          backgroundColor: this.theme.isDark
            ? 'rgb(26,26,26)' : 'rgb(229,229,229)'
        };
      }
    }
  });
</script>

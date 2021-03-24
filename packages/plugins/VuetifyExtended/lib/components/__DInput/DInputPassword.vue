<script>
  import { VTextField } from 'vuetify/lib/components';

  export default {
    name: 'DInputPassword',

    mixins: [VTextField],

    props: {
      outlined: {
        type: Boolean,
        default: true
      },
      // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
      appendIcon: { delete: true },
      // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
      type: { delete: true }
    },

    data() {
      return {
        isHidden: true
      };
    },

    computed: {
      // eslint-disable-next-line vue/no-dupe-keys
      appendIcon() { return this.isHidden ? 'visibility' : 'visibility_off'; },
      // eslint-disable-next-line vue/no-dupe-keys
      type() { return this.isHidden ? 'password' : 'text'; }
    },

    mounted() {
      this.listeners$['click:append'] = () => {
        this.isHidden = !this.isHidden;
      };
      this.$on('click:append', this.listeners$['click:append']);
    }
  };
</script>

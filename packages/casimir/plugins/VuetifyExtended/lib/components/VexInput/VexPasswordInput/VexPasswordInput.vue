<script>
  import { defineComponent } from '@casimir/platform-util';
  /* eslint-disable */
  import { VTextField } from 'vuetify/lib/components';
  /* eslint-enable */

  /**
   * Password input
   * @see See [text field](https://vuetifyjs.com/en/components/text-fields/)
   */
  export default defineComponent({
    name: 'VexPasswordInput',

    mixins: [VTextField],

    data() {
      return {
        isHidden: true
      };
    },

    computed: {
      // eslint-disable-next-line vue/no-dupe-keys
      appendIcon() { return this.isHidden ? 'mdi-eye-outline' : 'mdi-eye-off-outline'; },
      // eslint-disable-next-line vue/no-dupe-keys
      type() { return this.isHidden ? 'password' : 'text'; }
    },

    mounted() {
      this.listeners$['click:append'] = () => {
        this.isHidden = !this.isHidden;
      };
      this.$on('click:append', this.listeners$['click:append']);
    },

    beforeCreate() {
      this.$delete(this.$options.props, 'appendIcon');
      this.$delete(this.$options.props, 'type');
    }
  });
</script>

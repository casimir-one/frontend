<script>
  import { defineComponent } from '@deip/platform-fns';
  /* eslint-disable */
  import { VFileInput, VChip, VTextField } from 'vuetify/lib/components';
  /* eslint-enable */

  export default defineComponent({
    name: 'VexFileInput',
    mixins: [VFileInput],
    props: {
      smallChips: {
        type: Boolean,
        default: true
      },
      chipAsLabel: {
        type: Boolean,
        default: true
      },
      chipColor: {
        type: String,
        default: 'primary'
      },
      outlined: {
        type: Boolean,
        default: true
      },
      prependIcon: {
        type: String,
        default: null
      },
      appendIcon: {
        type: String,
        default: '$file'
      },
      existsFiles: {
        type: [String, Array],
        default: undefined
      }
    },
    computed: {
      classes() {
        return {
          ...VTextField.options.computed.classes.call(this),
          'v-file-input': true,
          'vex-file-input': true
        };
      }
    },
    methods: {
      genChips() {
        if (!this.isDirty) return [];

        return this.text.map((text, index) => this.$createElement(VChip, {
          props: {
            small: this.smallChips,
            label: this.chipAsLabel,
            color: this.chipColor,
            close: true
          },
          on: {
            'click:close': () => {
              const { internalValue } = this;
              internalValue.splice(index, 1);
              this.internalValue = internalValue; // Trigger the watcher
            }
          }
        }, [text]));
      }
    }
  });
</script>

<style lang="scss">
  .vex-file-input {
    .v-file-input__text--chips {
      margin-left: -4px;
    }
  }
</style>

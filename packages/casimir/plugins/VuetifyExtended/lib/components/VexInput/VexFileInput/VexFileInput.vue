<script>
  import { defineComponent } from '@casimir.one/platform-util';
  /* eslint-disable */
  import { VFileInput, VChip, VTextField } from 'vuetify/lib/components';
  /* eslint-enable */

  /**
   * Simpe file input
   * @see See [file inputs](https://vuetifyjs.com/en/components/file-inputs/)
   */
  export default defineComponent({
    name: 'VexFileInput',
    mixins: [VFileInput],
    props: {
      /** Small chips with file names */
      smallChips: {
        type: Boolean,
        default: true
      },
      /** Chip as label */
      chipAsLabel: {
        type: Boolean,
        default: true
      },
      /** Chip color */
      chipColor: {
        type: String,
        default: 'primary'
      },
      /** Prepend icon */
      prependIcon: {
        type: String,
        default: null
      },
      /** Append icon */
      appendIcon: {
        type: String,
        default: '$file'
      },
      /** Initial files */
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
      /**
       * Generate chips
       * @returns {Array.<VNode>}
       */
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

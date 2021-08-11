<script>
  /* eslint-disable import/extensions, import/no-unresolved */
  import { VInput, VLabel } from 'vuetify/lib/components';
  import Validatable from 'vuetify/lib/mixins/validatable';
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import { Resize } from 'vuetify/lib/directives';
  /* eslint-enable import/extensions, import/no-unresolved */

  import { defineComponent } from '@deip/platform-util';
  import VueEditorjs from '@deip/vue-editorjs';
  import { isEqual } from '@deip/toolbox/lodash';

  import { getBindableProps } from '../../composables';

  export default defineComponent({
    name: 'VexRichedit',

    components: { VueEditorjs },

    directives: {
      Resize
    },

    mixins: [VInput],

    props: {
      ...VueEditorjs.options.props,
      outlined: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        initialValue: null,
        labelWidth: 0,
        isBooted: false
      };
    },

    computed: {
      internalValue: {
        get() {
          return this.lazyValue;
        },
        set(val) {
          this.lazyValue = val;
          this.$emit('input', this.lazyValue);
        }
      },
      classes() {
        return {
          ...VInput.options.computed.classes.call(this),
          'v-textarea': true,
          'v-text-field': true,
          'v-text-field--outlined': this.outlined,
          'v-text-field--enclosed': this.isEnclosed,
          'v-text-field--is-booted': this.isBooted
        };
      },
      computedColor() {
        const computedColor = Validatable.options.computed.computedColor.call(this);

        if (!this.isFocused) return computedColor;

        return this.color || 'primary';
      },
      isDirty() {
        return !isEqual(this.lazyValue, {}) || this.lazyValue?.blocks?.length === 0;
      },
      isEnclosed() {
        return this.outlined;
      },
      labelValue() {
        return this.isFocused || this.isLabelActive;
      }
    },

    watch: {
      outlined: 'setLabelWidth',
      isFocused: 'updateValue',
      label() {
        this.$nextTick(this.setLabelWidth);
      }
    },

    mounted() {
      this.$watch(() => this.labelValue, this.setLabelWidth, { immediate: true });
      requestAnimationFrame(() => { this.isBooted = true; });
    },

    methods: {
      onInput(value) {
        this.internalValue = value;
      },

      onFocus() {
        if (this.isFocused || this.isDisabled) return;

        this.isFocused = true;
      },

      onBlur() {
        if (!this.isFocused || this.isDisabled) return;

        this.isFocused = false;
      },

      setLabelWidth() {
        if (!this.outlined) return;

        this.labelWidth = this.$refs.label
          ? Math.min(this.$refs.label.scrollWidth * 0.75 + 6, this.$el.offsetWidth - 24)
          : 0;
      },

      genEditor() {
        return this.$createElement('VueEditorjs', {
          props: {
            ...getBindableProps.call(this, VueEditorjs.options.props),
            placeholder: null,
            value: this.internalValue
          },
          staticClass: 'px-6 pt-6 text--primary',
          class: {
            'text--disabled': this.isDisabled
          },
          style: { width: '100%' },
          on: {
            change: this.onInput,
            blur: this.onBlur,
            focus: this.onFocus
          },
          directives: [{
            name: 'resize',
            modifiers: { quiet: true },
            value: this.onResize
          }]
        });
      },

      genTextFieldSlot() {
        return this.$createElement('div', {
                                     staticClass: 'v-text-field__slot'
                                   },
                                   [
                                     this.genLabel(),
                                     this.genEditor()
                                   ]);
      },

      genDefaultSlot() {
        return [
          this.genFieldset(),
          this.genTextFieldSlot()
        ];
      },

      genFieldset() {
        if (!this.outlined) return null;

        return this.$createElement('fieldset', {
          attrs: {
            'aria-hidden': true
          }
        }, [this.genLegend()]);
      },

      genLabel() {
        if (!this.hasLabel) return null;

        return this.$createElement(VLabel, {
          props: {
            absolute: true,
            color: this.validationState,
            dark: this.dark,
            disabled: this.isDisabled,
            focused: this.isFocused,
            for: this.computedId,
            light: this.light,
            value: this.labelValue
          }
        }, this.$slots.label || this.label);
      },

      genLegend() {
        const width = (this.labelValue || this.isDirty) ? this.labelWidth : 0;
        const span = this.$createElement('span', {
          domProps: { innerHTML: '&#8203;' },
          staticClass: 'notranslate'
        });

        return this.$createElement('legend', {
          style: {
            width: convertToUnit(width)
          }
        }, [span]);
      },

      updateValue(val) {
        // Sets validationState from validatable
        this.hasColor = val;

        if (val) {
          this.initialValue = this.lazyValue;
        } else if (!isEqual(this.initialValue, this.lazyValue)) {
          this.$emit('change', this.lazyValue);
        }
      },

      onResize() {
        this.setLabelWidth();
      }
    }
  });
</script>

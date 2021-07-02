import { cloneDeep, isEqual } from '@deip/toolbox/lodash';
import { FORM_MODES } from '@deip/constants';

const formFactory = (
  prop = 'value',
  event = 'input',
  defaultPropValue = () => ({})
) => ({
  name: 'FormFactory',

  model: {
    prop,
    event
  },
  props: {
    [prop]: {
      type: Object,
      default: defaultPropValue
    },

    mode: {
      type: [String, Number],
      default: FORM_MODES.CREATE,
      validation(value) {
        return FORM_MODES.keys().indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      lazyFormData: {},

      disabled: false,
      loading: false,

      oldValue: null
    };
  },

  computed: {
    formData: {
      get() {
        return this.lazyFormData;
      },
      set(val) {
        if (isEqual(val, this.lazyFormData)) return;
        this.lazyFormData = val;
        this.$emit('input', val);
      }
    },

    untouched() {
      return this.oldValue && isEqual(this.oldValue, this.lazyFormData);
    }
  },

  watch: {
    [prop]: {
      handler(val) {
        if (val && !isEqual(val, this.lazyFormData)) this.lazyFormData = val;
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    if (this[prop]) {
      this.oldValue = cloneDeep(this[prop]);
    }
  },

  methods: {
    restoreOldValue() {
      this.lazyFormData = this.oldValue;
    }
  }
});

const formMixin = formFactory();

export { formFactory, formMixin };

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

      oldValue: null,
      forceUpdateKey: Date.now()
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
    },

    isEditMode() {
      return this.mode === FORM_MODES.EDIT;
    }
  },

  watch: {
    [prop]: {
      handler(val) {
        if (val && !isEqual(val, this.lazyFormData)) this.lazyFormData = val;
        if (val && !isEqual(val, this.oldValue)) this.oldValue = cloneDeep(this[prop]);
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    restoreOldValue(forceUpdate = false) {
      this.lazyFormData = this.oldValue;
      if (forceUpdate) {
        this.forceUpdateKey = Date.now();
      }
    }
  }
});

const formMixin = formFactory();

export { formFactory, formMixin };

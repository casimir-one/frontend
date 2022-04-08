import { cloneDeep, isEqual } from '@deip/toolbox/lodash';
import { VIEW_MODE } from '@deip/constants';

/**
 * Create form mixin
 * @param {string} [prop=value]
 * @param {string} [event=input]
 * @param {Function} [defaultPropValue=() => ({})]
 * @param {Object} [lazyFormData={}]
 * @returns {Object} Vue mixin object
 */
const formFactory = (
  prop = 'value',
  event = 'input',
  defaultPropValue = () => ({}),
  lazyFormData = {}
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
      default: VIEW_MODE.CREATE,
      validator(value) {
        return VIEW_MODE.values().indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      lazyFormData: cloneDeep(lazyFormData),

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
        this.$emit(event, val);
      }
    },

    untouched() {
      return this.oldValue && isEqual(this.oldValue, this.lazyFormData);
    },

    isEditMode() {
      return this.mode === VIEW_MODE.EDIT;
    }
  },

  watch: {
    [prop]: {
      handler(val) {
        if (val && !isEqual(val, this.lazyFormData)) {
          this.lazyFormData = cloneDeep(val);
        }
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    if (this[prop]) {
      this.setOldValue();
    }
  },

  methods: {
    setOldValue() {
      this.oldValue = cloneDeep(this[prop]);
    },

    restoreOldValue(forceUpdate = false) {
      this.lazyFormData = this.oldValue;
      if (forceUpdate) {
        this.forceUpdateKey = Date.now();
      }
    }
  }
});

/**
 * Create form mixin with default params
 */
const formMixin = formFactory();

export { formFactory, formMixin };

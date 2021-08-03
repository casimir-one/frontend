import { cloneDeep, isEqual } from '@deip/toolbox/lodash';
import { VIEW_MODE } from '@deip/constants';

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
      validation(value) {
        return VIEW_MODE.keys().indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      lazyFormData,

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

const formMixin = formFactory();

export { formFactory, formMixin };

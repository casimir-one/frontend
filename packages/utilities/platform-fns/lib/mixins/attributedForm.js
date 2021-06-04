import { cloneDeep, isEqual } from 'lodash/fp';
import {
  compactAttributes,
  expandAttributes
} from '../helpers';

const attributedFormFactory = (
  prop = 'value',
  event = 'input',
) => ({
  name: 'AttributedForm',

  model: {
    prop,
    event
  },

  props: {
    [prop]: {
      type: Object,
      default: () => ({})
    },

    schema: {
      type: Array,
      default: () => []
    },
    components: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      lazyFormData: null,

      disabled: false,
      loading: false,

      oldValue: null
    };
  },

  computed: {
    formData: {
      get() {
        return {
          ...this.lazyFormData,
          ...{
            attributes: expandAttributes(this.lazyFormData.attributes)
          }
        };
      },
      set(val) {
        if (isEqual(val, this.lazyFormData)) return;
        this.lazyFormData = {
          ...val,
          ...{
            attributes: compactAttributes(val.attributes)
          }
        };
        this.$emit(event, val);
      }
    },

    untouched() {
      return this.oldValue && isEqual(this.oldValue, this.value);
    }
  },

  watch: {
    [prop]: {
      handler(val) {
        if (val && !isEqual(this.value, this.lazyFormData)) this.lazyFormData = val;
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    if (this.value) {
      this.oldValue = cloneDeep(this.value);
    }
  }
});

const AttributedForm = attributedFormFactory();

export default AttributedForm;
export {
  AttributedForm,
  attributedFormFactory
};

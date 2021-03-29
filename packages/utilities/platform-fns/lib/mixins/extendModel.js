import { hasValue, isArray, isObject } from '@deip/toolbox';
import Proxyable from 'vuetify/lib/mixins/proxyable';

// Array model setups

export const arrayedModel = {
  mixins: [Proxyable],
  
  created() {
    this.internalLazyValue = this.value !== undefined
        ? this.value
        : []

    if (!isArray(this.internalValue)) {
      console.warn('Model must be bound to an Array.', this.$options.name);
    }
  }
};

export const arrayModelAddFactory = (modelFactory) => ({
  mixins: [arrayedModel],

  methods: {
    addItem() {
      this.internalValue = [
        ...this.internalValue,
        ...[modelFactory()]
      ];
    },

    removeItem(item) {
      const idx = this.internalValue.indexOf(item);
      if (idx !== -1) {
        this.internalValue.splice(idx, 1);
        this.internalValue = [...new Set(this.internalValue)];
      }
    },

    clearItems() {
      this.internalValue = [];
    },

    addStartItem() {
      if (!this.internalValue.length) {
        this.addItem();
      }
    }
  }
});

export const activatableArrayModelFactory = (modelFactory) => ({
  mixins: [arrayModelAddFactory(modelFactory)],
  data() {
    return {
      modelActive: false
    };
  },

  watch: {
    modelActive(val) {
      if (!val) {
        this.clearItems();
      }

      if (val && !this.internalValue.length) {
        this.addItem();
      }
    }
  },

  created() {
    if (hasValue(this.internalValue)) {
      this.modelActive = true;
    }
  }
});

// Object model setups

export const objectedModel = {
  mixins: [Proxyable],
  data() {
    return {
      internalLazyValue: this.value !== undefined
        ? this.value
        : {}
    };
  },
  watch: {
    internalValue: {
      deep: true,
      handler(val) {
        this.$emit('change', val);
      }
    }
  },
  created() {
    if (!isObject(this.internalValue)) {
      console.warn('Model must be bound to an Object.', this.$options.name);
    }
  }
};

// Null model setups

export const nulledModel = {
  mixins: [Proxyable],
  data() {
    return {
      internalLazyValue: this.value !== undefined
        ? this.value
        : null
    };
  },
  created() {
    if (this.value === undefined) {
      this.$emit('change', this.internalValue);
    }
  }
};

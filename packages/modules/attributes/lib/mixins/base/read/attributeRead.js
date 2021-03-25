import { attributesChore } from '../../attributesChore';
import { hasValue } from '@deip/toolbox';

export const attributeRead = {
  mixins: [attributesChore],
  props: {
    attribute: {
      type: Object,
      default: () => ({})
    },

    project: {
      type: Object,
      default: () => ({})
    },

    viewType: {
      type: String,
      default: undefined
    }
  },
  computed: {
    attributeInfo() {
      return this.attribute;
      // TODO: fix when attributes service is ready
      // const { tenantId } = this.project.researchRef;
      // const { researchAttributes } = this.$store.getters['Tenants/one'](tenantId).profile.settings

      // const id = this.attribute._id || this.attribute.researchAttributeId;
      // return this.$$getAttributeInfo(id, researchAttributes);
    },
    attrHasData() {
      return this.attribute && hasValue(this.attribute.value);
    }
  },
  methods: {
    genContent(h) {
      if (this.clamped) {
        return h('v-clamp', {
          props: {
            autoresize: true,
            // eslint-disable-next-line radix
            maxLines: parseInt(this.clamped),
            viewType: this.viewType
          },
          class: {
            'visually-hidden': this.attribute.isHidden
          }
        }, this.attribute.value);
      }
      return this._v(this.attribute.value);
    }
  },
  render(h) {
    return this.attrHasData ? this.genContent(h) : false;
  }
};

export const attributeReadOption = {
  mixins: [attributeRead],
  computed: {
    valueOption() {
      return this.$where(
        this.attributeInfo.valueOptions,
        {
          '+value': this.attribute.value
        }
      )[0];
    }
  }
};

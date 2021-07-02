/* eslint-disable */
import { VExpandTransition } from 'vuetify/lib/components';
import Toggleable from 'vuetify/lib/mixins/toggleable';
import Bootable from 'vuetify/lib/mixins/bootable';
import ripple from 'vuetify/lib/directives/ripple';
import { getSlot } from 'vuetify/lib/util/helpers';
/* eslint-enable */

export const VexExpand = {
  name: 'VexExpand',

  mixins: [Toggleable, Bootable],

  directives: {
    ripple
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    activatorTag: {
      type: String,
      default: 'div'
    },
    contentTag: {
      type: String,
      default: 'div'
    },
    tag: {
      type: String,
      default: 'div'
    }
  },

  methods: {
    click(e) {
      if (this.disabled) return;
      this.isBooted = true;
      this.$emit('click', e);
      this.$nextTick(() => {
        this.isActive = !this.isActive;
      });
    },

    genActivator() {
      return this.$createElement(
        this.activatorTag,
        {
          on: {
            click: this.click
          },
          directives: [{
            name: 'ripple',
            value: this.ripple
          }]
        },
        [
          this.$scopedSlots.activator({
            active: this.isActive,
            toggle: this.click
          })
        ]
      );
    },

    genContent() {
      return this.$createElement(
        this.contentTag,
        {
          directives: [{
            name: 'show',
            value: this.isActive
          }]
        },
        [getSlot(this)]
      );
    }
  },

  render(h) {
    return h(this.tag, [
      this.genActivator(),
      h(VExpandTransition, [this.genContent()])
    ]);
  }
};

/* eslint-disable */
import { VExpandTransition } from 'vuetify/lib/components';
import Toggleable from 'vuetify/lib/mixins/toggleable';
import Bootable from 'vuetify/lib/mixins/bootable';
import ripple from 'vuetify/lib/directives/ripple';
import { getSlot } from 'vuetify/lib/util/helpers';
/* eslint-enable */
import { defineComponent } from '@casimir/platform-util';

/**
 * Component for expand/collapse content on activator click
 */
export default defineComponent({
  name: 'VexExpand',

  directives: {
    ripple
  },

  mixins: [Toggleable, Bootable],

  props: {
    /** Disabled */
    disabled: {
      type: Boolean,
      default: false
    },
    /** Ripple on the activator */
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    /** Activator tag */
    activatorTag: {
      type: String,
      default: 'div'
    },
    /** Content tag */
    contentTag: {
      type: String,
      default: 'div'
    },
    /** Tag */
    tag: {
      type: String,
      default: 'div'
    }
  },

  methods: {
    /**
     * Handle click event
     * @param {Event} e
     */
    handleActivatorClick(e) {
      if (this.disabled) return;
      this.isBooted = true;
      /** Click event */
      this.$emit('click', e);
      this.$nextTick(() => {
        this.isActive = !this.isActive;
      });
    },

    /**
     * Generate activator
     * @returns {VNode}
     */
    genActivator() {
      return this.$createElement(
        this.activatorTag,
        {
          on: {
            click: this.handleActivatorClick
          },
          directives: [{
            name: 'ripple',
            value: this.ripple
          }]
        },
        [
          this.$scopedSlots.activator({
            active: this.isActive,
            toggle: this.handleActivatorClick
          })
        ]
      );
    },

    /**
     * Generate content
     * @returns {VNode}
     */
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
});

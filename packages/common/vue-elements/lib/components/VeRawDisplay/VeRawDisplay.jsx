import { defineComponent } from '@deip/platform-util';

/**
 * Display raw data toggled by a button
 */
export default defineComponent({
  name: 'VeRawDisplay',
  props: {
    /**
     * Button label
     */
    label: {
      type: String,
      default: 'Debug'
    },
    /**
     * Data
     */
    value: {
      type: [Object, Array, String],
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    valueString() {
      return JSON.stringify(this.value, null, 2);
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  },
  render() {
    return (
      <div class={{
        've-raw-display': true,
        've-raw-display--is-open': this.isOpen
      }}>
        <button
          class="ve-raw-display__btn"
          onClick={this.toggle}
        >
          {this.label}
        </button>
        <div class="ve-raw-display__block">
          <pre>{this.valueString}</pre>
        </div>
      </div>
    );
  }
});

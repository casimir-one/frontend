import Vue, { CreateElement, VNode } from 'vue';

export default Vue.extend({
  name: 'TestComponentTsx',

  data() {
    return {
      name: 'Test',
    };
  },

  methods: {
    handleClick(): void {
      // click
    },
  },

  render(h: CreateElement): VNode {
    return (
      <div class="test-component-tsx" attribs={{ 'data-id': '12' }}>
        {this.name}
      </div>
    );
  },
});

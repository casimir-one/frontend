<template>
  <div class="test-component">
    Test Component {{ parsed }}
  </div>
</template>

<script lang="ts">
  import * as qs from 'qs';

  const parsed = qs.parse('?d=s');

  export default {
    name: 'TestComponent',

    data() {
      return {
        parsed
      };
    },

    methods: {
      handleClick(): void {
        // eslint-disable-next-line no-console
        console.log('test');
      }
    }
  };
</script>

<style lang="scss">
.test-component {
  $this: ".test-component";
  background-color: white;
  border: 1px solid grey;
  padding: 10px;
}
</style>

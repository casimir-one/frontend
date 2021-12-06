<template>
  <div class="test-component-decorator">
    {{ text }}
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class TestComponentDecorator extends Vue {
    name = 'TestComponentDecorator'

    @Prop({ default: 'Text' }) text!: string;

    handleClick(): void {
      // eslint-disable-next-line no-console
      console.log('test-two');
    }
  }
</script>

<style lang="scss">
.test-component-decorator {
  $this: ".test-component-decorator";
  background-color: white;
  border: 1px solid grey;
  padding: 10px;
}
</style>

<template>
  <div class="{{componentCssName}}">{{ text }}</div>
</template>

<script>
  export default {
    name: '{{componentName}}',
    props: {
      text: {
        type: String
      }
    }
  }
</script>

<style lang="scss">
  .{{componentCssName}} { }
</style>
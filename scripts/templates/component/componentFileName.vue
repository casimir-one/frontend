<template>
  <div :class="$style.host">
    <div :class="$style.constent"> {{ text }} </div>
  </div>
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

<style lang="scss" module>
  .host { }

  .content { }
</style>

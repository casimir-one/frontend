<template>
  <div>{{ users.map((u) => u.username).length }}</div>
</template>

<script>
  export default {
    name: 'UsersListDefault',
    props: {
      users: {
        type: Array,
        default: () => ([])
      },
      loading: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

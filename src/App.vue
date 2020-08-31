<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$router.push({
      name: "Login",
      query:{}
    })
  },
}
</script>

<style scoped>
#app {

}
</style>

<template>
  <Nav />
  <div id="app" class="container">
    <router-view />
  </div>
</template>

<script>
  import Nav from './components/partials/Nav.vue';
  export default {
    name: 'app',
    components: {
      Nav,
    },
  };
</script>


<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>

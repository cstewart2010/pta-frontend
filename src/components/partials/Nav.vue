<template>
  <nav class="navbar container" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <strong class="is-size-4">Pokemon Tabletop Adventures 3</strong>
      </a>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Landing</router-link>
        <router-link to="/about" class="navbar-item">About</router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark" @click="toGames">
              <strong>Search for Game</strong>
            </a>
            <a class="button is-dark" @click="toGM">
              <strong>Start Session</strong>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end" hidden>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark" @click="logout">
              <strong>Log out</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    name: 'Nav',
    props: {
        isAuthenticated: {
            default: false
        }
    },
    beforeMount:function(){
      
    },
    methods: {
      toGM(){
        this.$router.push({
          name: 'Registration',
          params: {
            isGM: true
          }
        });
      },
      toGames(){
        this.$router.push('Games');
      },
      logout(){
        alert('need to implement trainer.api module');
        alert(this.actuallyAuthenticated);
      }
    }
  };
</script>
<style lang="scss" scoped>
  nav {
    margin-top: 25px;
    margin-bottom: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #d88d00;
      }
    }
  }
</style>
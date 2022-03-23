<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <div class="navbar-brand">Pokemon Tabletop Adventures 3</div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Landing</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        <li class="nav-item" v-if="isGM==true && needsToAuthenticate==false">
          <router-link to="/gm" class="nav-link">Game Master</router-link>
        </li>
        <li class="nav-item" v-else-if="isGM==false && needsToAuthenticate==false">
          <router-link to="/trainer" class="nav-link">Trainer</router-link>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==true">
          <button class="btn nav-link" @click="toGames">Search for Game</button>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==true">
          <button class="btn nav-link" @click="toGM">Start Session</button>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==false">
          <button class="nav-link" @click="logout">Log out</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>
<script>
import { getIsAuthenticate, getIsGM, removeFromStorage } from '../../utils/localStorage';
import { userLogout } from '../../api/trainer.api';
  export default {
    name: 'Nav',
    data(){
      return {
        needsToAuthenticate: false,
        isGM: false,
      }
    },
    mounted:function(){
      this.needsToAuthenticate = !getIsAuthenticate();
      this.isGM = getIsGM() === true;
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
        this.$router.push('/games');
      },
      async logout(){
        await userLogout()
          .then(() => {
            this.$router.push('/');
            removeFromStorage();
            this.needsToAuthenticate = true
          })
          .catch(console.log);
      }
    }
  };
</script>
<style lang="scss" scoped>
  nav {
    padding-top: 25px;
    padding-bottom: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
    }
  }
</style>
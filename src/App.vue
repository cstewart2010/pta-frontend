<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <landing-page v-if="needsToAuthenticate" />
  <game-control v-else />
</template>

<script>
import GameControl from './components/GameControl.vue'
import LandingPage from './components/LandingPage.vue'

export default {
  name: 'App',
  components: {
    GameControl,
    LandingPage
  },
  data() {
      return {
          gameId: null,
          trainerId: null,
          ptaActivityToken: null,
          ptaSessionAuth: null,
          needsToAuthenticate: true
      }
  },
  mounted:function(){
    const authString = window.localStorage.getItem("ptaAuthString");
    if (!authString){
      this.needsToAuthenticate = true
      return;
    }

    try {
      const auth = JSON.parse(authString);
      this.ptaActivityToken = auth.ptaActivityToken
      this.ptaSessionAuth = auth.ptaSessionAuth
      this.trainerId = auth.trainerId
      this.gameId = auth.gameId
      this.needsToAuthenticate = auth.needsToAuthenticate
    }
    catch {
      this.needsToAuthenticate = true
    }
    // authenticate trainer using api
  },
  methods: {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <div class="navbar-brand">Pokemon Tabletop Adventures 3</div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item" v-if="isAdmin">
          <router-link to="/missionControl" class="nav-link">Mission Control</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link">Landing</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        <li class="nav-item" v-if="gameId && isGM==true && needsToAuthenticate==false">
          <router-link to="/trade" class="nav-link">Trade Center</router-link>
        </li>
        <li class="nav-item" v-if="gameId && needsToAuthenticate==false">
          <router-link to="/encounter" class="nav-link">Encounter</router-link>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==false">
          <router-link to="/games" class="nav-link">Games</router-link>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==false">
          <router-link to="/new" class="nav-link">New Game</router-link>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate==false">
          <router-link to="/" class="nav-link" @click="logout">Log out</router-link>
        </li>
        <li class="nav-item" v-if="needsToAuthenticate">
          <router-link to="/registration" class="nav-link">Sign up</router-link>
        </li>
      </ul>
    </div>
    <form class="d-inline-flex flex-column flex-lg-row" @submit.prevent="login" v-if="needsToAuthenticate">
      <span class="input-group-text">Username: </span>
      <input type="text" v-model="username">
      <span class="input-group-text">Password: </span>
      <input type="password" v-model="password">
      <button type="submit" class="btn btn-primary">Sign in</button>
    </form>
  </div>
</nav>
</template>
<script>
import { getGameId, getIsAdmin, getIsAuthenticate, getIsGM, removeFromStorage, setInitialCredentials, setIsAdmin } from '../../utils/localStorage';
import { login, logout } from '../../api/user.api';
import { generateErrorModal } from '../../utils/modalUtil';
  export default {
    name: 'Nav',
    data(){
      return {
        needsToAuthenticate: false,
        isGM: false,
        gameId: getGameId(),
        username: '',
        password: '',
        isAdmin: false
      }
    },
    mounted:function(){
      this.needsToAuthenticate = !getIsAuthenticate();
      this.isGM = getIsGM() === true;
      this.isAdmin = getIsAdmin() === true;
    },
    methods: {
      async login(){
        console.log(this.username)
        await login(this.username, this.password)
          .then(response => {
            setIsAdmin(response.data.isAdmin);
            this.pushToNext(response.data.user, response.headers);
          })
          .catch(generateErrorModal);
      },
      async logout(){
        await logout()
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            removeFromStorage();
            this.needsToAuthenticate = true
            this.isAdmin = false;
            window.location.href = "/"
          });
      },
      pushToNext(user, headers){
          setInitialCredentials(user, headers);
          window.location.href = "/"
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
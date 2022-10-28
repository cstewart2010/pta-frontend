<template>
<nav class="navbar navbar-expand-xl navbar-dark bg-dark py-2">
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
          <a class="nav-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-journal" aria-controls="offcanvas-journal" v-if="gameId">Journal</a>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        <li class="nav-item" v-if="gameId && isGM==true && needsToAuthenticate==false">
          <router-link to="/trade" class="nav-link">Trade Center</router-link>
        </li>
        <li class="nav-item" v-if="gameId && needsToAuthenticate==false">
          <router-link to="/setting" class="nav-link">Setting</router-link>
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
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="other-stuff" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Other Stuff
          </a>
          <ul class="dropdown-menu" aria-labelledby="other-stuff">
            <li>
              <router-link class="dropdown-item" to="/documentation">Documentation</router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/credits">Credits</router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/bug">Report A Bug</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <form id="nav-form" class="row g-1 needs-validation my-2" @submit.prevent="login" v-if="needsToAuthenticate" novalidate>
      <div class="col-lg">
        <input class="form-control" id="username" type="text" v-model="username" placeholder="Username" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
        <validation-feedback :useInvalid="false" />
      </div>
      <div class="col-lg">
        <input class="form-control" id="password" type="password" v-model="password" placeholder="Password" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
        <validation-feedback :useInvalid="false" />
      </div>
      <div class="col-12 col-lg">
        <button type="submit" class="btn btn-primary">Sign in</button>
      </div>
    </form>
  </div>
</nav>
<div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvas-journal" aria-labelledby="offcanvas-journalLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvas-journalLabel">Journal</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <journal />
  </div>
</div>
</template>
<script>
import { getGameId, getIsAdmin, getIsAuthenticate, getIsGM, removeFromStorage, setInitialCredentials, setIsAdmin } from '../../utils/localStorage';
import { login, logout } from '../../api/user.api';
import { generateErrorModal } from '../../utils/modalUtil';
import Journal from '../../views/Journal.vue'
import { checkValidation } from '../../utils/credentials';
import ValidationFeedback from "./ValidationFeedback.vue"
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
    components: {
      Journal,
      ValidationFeedback
    },
    mounted:function(){
      this.needsToAuthenticate = !getIsAuthenticate();
      this.isGM = getIsGM() === true;
      this.isAdmin = getIsAdmin() === true;
    },
    methods: {
      async login(){
        if (!checkValidation('nav-form')){
          return;
        }
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
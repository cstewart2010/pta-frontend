<template>
  <div class="about" v-if="!user">
    <h1>This is an about page</h1>
  </div>
  <div v-else>
    <div>{{user.username.toUpperCase()}}</div>
    <div>User since {{date.toLocaleString()}}</div>
    <div>Member of {{user.games.length}} {{conjugation}}</div>
  </div>
</template>

<script>
import { getUser } from '../utils/localStorage'
export default {
  name: 'About',
  data() {
    return {
      user: getUser(),
      date: new Date(),
      conjugation: 'games'
    }
  },
  mounted(){
    if (this.user){
      this.date = new Date(this.user.dateCreated + 'Z');
      if (this.user.games.length == 1){
        this.conjugation = 'game'
      }
    }
  }
}
</script>

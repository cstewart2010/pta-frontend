<template>
    <GameControl v-bind:nickname="nickname" />
    <input type="text" name="nickname" id="nickname">
    <button class="btn btn-primary" @click="refresh()">Search</button>
</template>

<script>
import GameControl from '../components/GameControl.vue'

export default {
    name: "Games",
    components: {
        GameControl
    },
    props: {
        nickname: null
    },
    methods: {
        refresh(){
            const nickname = document.getElementById("nickname").value;
            if (nickname && nickname != ''){
                this.$router.push({
                    name: 'GamesRedirect',
                    params: {
                        nickname
                    }
                })
            }
            else {
                this.$router.push('/games')
            }
        }
    }
}
</script>

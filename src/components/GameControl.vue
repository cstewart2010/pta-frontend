<template>
    <div>
        <h2>Game Control</h2>
        <div class="row">
            <button class="col-md-4 btn btn-primary" v-for="(game, index) in games" v-bind:key="index" v-bind:id="game.gameId" @click="getGame(game.gameId)">
                {{JSON.stringify(game)}}
            </button>
        </div>
    </div>
</template>

<script>
    import { findGameById, findAllGames, findAllGamesByNickname } from "../api/game.api";

    export default {
        name: "GameControl",
        props: {
            nickname: null
        },
        data(){
            return {
                games: null
            }
        },
        mounted:async function(){
            if (this.nickname){
                this.games = await this.getGamesByNickname();
            }
            else {
                this.games = await this.getGames();
            }
        },
        methods: {
            async getGame(gameId) {
                const response = await findGameById(gameId);
                if (response){
                    alert(JSON.stringify(response.data));
                }
            },
            async getGamesByNickname(){
                const response = await findAllGamesByNickname(this.nickname);
                if (response){
                    return response.data
                }
            },
            async getGames(){
                const response = await findAllGames();
                if (response){
                    return response.data
                }
            }
        }
    }
</script>
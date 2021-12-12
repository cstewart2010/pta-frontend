<template>
    <div>
        <h2>Game Control</h2>
        <div class="row">
            <button class="col-md-4 btn btn-primary" v-for="(game, index) in games" :key="index" :id="game.gameId" @click="getGame(game.gameId)" data-bs-toggle="modal" data-bs-target="#notificationModal">
                {{JSON.stringify(game)}}
            </button>
            <notification-modal :title="title" :body="body" :options="modalOptions" />
        </div>
    </div>
</template>

<script>
    import { findGameById, findAllGames, findAllGamesByNickname } from "../api/game.api";
    import NotificationModal from "./partials/NotificationModal.vue";

    export default {
        name: "GameControl",
        props: {
            nickname: null
        },
        components: {
            NotificationModal
        },
        data(){
            return {
                games: null,
                gameId: null,
                title: 'Modal title',
                body: '...',
                modalOptions: null
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
                await findGameById(gameId)
                .then(response =>{
                    this.title = response.data.message;
                    this.body = response.data.trainers;
                    this.gameId = gameId;
                    this.modalOptions = {
                        name: 'Registration',
                        params: {
                            isGM: false
                        },
                        query: {
                            gameId: this.gameId
                        }
                    };
                })
                .catch(alert)
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
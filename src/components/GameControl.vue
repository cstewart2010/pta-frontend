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
    import { generateErrorModal } from "../utils/modalUtil"
    import NotificationModal from "./modals/NotificationModal.vue";

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
                await this.getGamesByNickname()
                    .then(data => {
                        this.games = data
                    })
                    .catch(generateErrorModal);
            }
            else {
                await this.getGames()
                    .then(data => {
                        this.games = data
                    })
                    .catch(generateErrorModal);
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
                    .catch(generateErrorModal);
            },
            async getGamesByNickname(){
                return await findAllGamesByNickname(this.nickname)
                    .then(response =>{
                        return response.data
                    })

            },
            async getGames(){
                return await findAllGames()
                    .then(response =>{
                        return response.data
                    })
            }
        }
    }
</script>
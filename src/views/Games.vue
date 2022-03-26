<template>
    <div>
        <h2 class="text-center">Game Control</h2>
        <div class="input-group mb-3">
            <span class="input-group-text">Search by nickname:</span>
            <input type="text" class="form-control" v-model="nickname" @input="update">
        </div>
        <div class="row">
            <div class="col-4" v-for="(game, index) in games" :key="index">
                <button class="btn btn-dark w-100" :id="game.gameId" @click="getGame(game.gameId, game.nickname)" data-bs-toggle="modal" data-bs-target="#notificationModal">
                    {{game.nickname}}
                </button>
            </div>
        </div>
    </div>
    <notification-modal :title="title" :participants="participants" :gameId="gameId" />
</template>

<script>
import { findAllGames, findAllGamesByNickname, findGameById } from '../api/game.api';
import NotificationModal from "../components/modals/NotificationModal.vue";
import { generateErrorModal } from '../utils/modalUtil';

export default {
    name: "Games",
    components: {
        NotificationModal
    },
    data() {
        return {
            nickname: null,
            games: [],
            gameId: null,
            title: 'Modal title',
            participants: [{
                isGM: false,
                trainerName: ''
            }]
        }
    },
    async beforeMount(){
        await this.update();
    },
    methods: {
        async update(){
            if (this.nickname && this.nickname.length > 0){
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
        async getGame(gameId, nickname) {
            await findGameById(gameId)
                .then(response =>{
                    this.title = nickname.toUpperCase();
                    this.participants = response.data.trainers;
                    this.gameId = gameId
                })
                .catch(generateErrorModal);
        },
        async getGamesByNickname(){
            return await findAllGamesByNickname(this.nickname)
                .then(response =>{
                    return response.data
                })
                .catch(generateErrorModal);

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

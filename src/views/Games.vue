<template>
    <div>
        <div class="my-4">
            <h3 class="text-center">Current Games</h3>
            <div class="row" v-if="currentGames.length">
                <div class="col-4" v-for="(game, index) in currentGames" :key="index">
                    <button class="btn btn-dark w-100" :id="game.gameId" @click="getGame(game.gameId, game.nickname)" data-bs-toggle="modal" data-bs-target="#notificationModal">
                        {{game.nickname}}
                    </button>
                </div>
            </div>
            <div class="text-center" v-else>There ain't none</div>
        </div>
        <div class="my-4">
            <h3 class="text-center">Search for New Games</h3>
            <div class="input-group mb-3">
                <span class="input-group-text">Search by nickname:</span>
                <input type="text" class="form-control" v-model="nickname" @input="update">
            </div>
            <div class="row">
                <div class="col-4" v-for="(game, index) in games" :key="index">
                    <button class="btn btn-dark w-100" :id="game.gameId" @click="getGame(game.gameId, game.nickname)" data-bs-toggle="modal" data-bs-target="#joinModal">
                        {{game.nickname}}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <notification-modal :title="title" :participants="participants" :gameId="gameId" />
    <join-modal :title="title" :participants="participants" :gameId="gameId" />
</template>

<script>
import { findAllGames, findAllGamesByNickname, findAllUserGames, findGameById } from '../api/game.api';
import NotificationModal from "../components/modals/NotificationModal.vue";
import JoinModal from "../components/modals/JoinModal.vue";
import { generateErrorModal } from '../utils/modalUtil';

export default {
    name: "Games",
    components: {
        NotificationModal,
        JoinModal
    },
    data() {
        return {
            nickname: null,
            currentGames: [],
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
            await findAllUserGames()
                .then(response => {
                    this.currentGames = response.data
                })
                .catch(generateErrorModal);
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

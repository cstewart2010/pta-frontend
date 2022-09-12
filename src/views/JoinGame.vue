<template>
    <h2 class="text-center">Join Game - {{nickname}}</h2>
    <form @submit.prevent="joinGame">
        <div class="input-group my-2">
            <span class="input-group-text">Username:</span>
            <input type="text" v-model="trainerName">
        </div>
        <button type="submit" class="btn btn-success my-2">Join Game</button>
    </form>
</template>

<script>
import { addPlayerToGame } from '../api/game.api'
import { getUserId, removeTrainers, setGameId, setIsGM, setPTAActivityToken } from '../utils/localStorage';
import { generateErrorModal } from '../utils/modalUtil';
export default {
    name: "JoinGame",
    props: {
        gameId: {
            default: null
        },
        nickname: {
            default: null
        }
    },
    data() {
        return {
            trainerName: '',
            userId: getUserId()
        }
    },
    methods: {
        async joinGame(){
            addPlayerToGame(this.gameId, this.trainerName, this.userId)
                .then(response => {
                    setIsGM(false);
                    setGameId(this.gameId);
                    removeTrainers();
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    window.location.href ='/';
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
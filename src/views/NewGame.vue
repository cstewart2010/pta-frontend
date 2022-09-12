<template>
    <h2 class="text-center">Create a New Game</h2>
    <form @submit.prevent="newGame">
        <div class="input-group my-2">
            <span class="input-group-text">Username:</span>
            <input type="text" v-model="gmName">
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Game Nickname:</span>
            <input type="text" v-model="nickname">
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Game Password:</span>
            <input type="password" v-model="gameSessionPassword">
        </div>
        <button type="submit" class="btn btn-success my-2">Create New Game</button>
    </form>
</template>

<script>
import { createNewGame } from '../api/game.api'
import { getUserId, removeTrainer, setGameId, setIsGM, setPTAActivityToken } from '../utils/localStorage'
import { generateErrorModal } from '../utils/modalUtil'
export default {
    name: "NewGame",
    data() {
        return {
            nickname: null,
            gmName: '',
            gameSessionPassword: '',
            userId: getUserId()
        }
    },
    methods: {
        async newGame(){
            await createNewGame(this.gmName, this.userId, this.gameSessionPassword, this.nickname)
                .then(response => {
                    setIsGM(true);
                    setGameId(response.data.gameId);
                    removeTrainer();
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    window.location.href ='/';
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
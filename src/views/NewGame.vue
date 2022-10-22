<template>
    <h2 class="text-center">Create a New Game</h2>
    <form :id="formId" @submit.prevent="newGame" class="row needs-validation" novalidate>
        <div class="col-md">
            <input class="form-control" id="username" placeholder="GameMaster Name" type="text" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" v-model="gmName" required>
            <validation-feedback name="Username" />
        </div>
        <div class="col-md">
            <input class="form-control" id="nickname" type="text" placeholder="Game Nickname" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" v-model="nickname" required>
            <validation-feedback name="Game nickname" />
        </div>
        <div class="col-md">
            <input class="form-control" id="nickname" type="password" placeholder="Game Password" minlength="6" pattern="^\w+( +\w+)*$" v-model="gameSessionPassword" required>
            <validation-feedback name="Password" />
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-success my-2">Create New Game</button>
        </div>
    </form>
</template>

<script>
import { createNewGame } from '../api/game.api'
import { checkValidation } from '../utils/credentials'
import { getUserId, removeTrainer, setGameId, setIsGM, setPTAActivityToken } from '../utils/localStorage'
import { generateErrorModal } from '../utils/modalUtil'
import ValidationFeedback from "../components/partials/ValidationFeedback.vue"
export default {
    name: "NewGame",
    data() {
        return {
            nickname: null,
            gmName: '',
            gameSessionPassword: '',
            userId: getUserId(),
            formId: 'new-game-form'
        }
    },
    components: {
        ValidationFeedback
    },
    methods: {
        async newGame(){
            if (!checkValidation(this.formId)){
                return;
            }
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
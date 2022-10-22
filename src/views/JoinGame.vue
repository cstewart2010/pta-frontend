<template>
    <h2 class="text-center">Join Game - {{nickname}}</h2>
    <form :id="formId" class="row needs-validation" @submit.prevent="joinGame" novalidate>
        <div class="col-md-3">
            <input class="form-control" placeholder="Trainer Name" type="text" name="trainerName" v-model="trainerName" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Trainer Name" />
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-success my-2">Join Game</button>
        </div>
    </form>
</template>

<script>
import { addPlayerToGame, findTrainerInGame } from '../api/game.api'
import { checkValidation } from '../utils/credentials';
import { getUserId, removeTrainers, setGameId, setIsGM, setPTAActivityToken, setTrainer } from '../utils/localStorage';
import { generateErrorModal } from '../utils/modalUtil';
import ValidationFeedback from "../components/partials/ValidationFeedback.vue"
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
            userId: getUserId(),
            formId: 'join-form'
        }
    },
    components: {
        ValidationFeedback
    },
    methods: {
        async joinGame(){
            if (!checkValidation(this.formId)){
                return;
            }
            addPlayerToGame(this.gameId, this.trainerName, this.userId)
                .then(response => {
                    setGameId(this.gameId);
                    removeTrainers();
                    setPTAActivityToken(response.headers['pta-activity-token']);
                })
                .then(() => {
                    findTrainerInGame(this.gameId, getUserId())
                        .then(response => {
                            setTrainer(response.data.trainer);
                            setIsGM(response.data.trainer.isGM);
                            window.location.href = "/";
                        })
                        .catch(generateErrorModal);
                })
        }
    }
}
</script>
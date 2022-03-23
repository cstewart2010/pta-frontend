<template>
    <h3>Sign Up</h3>
    <div class="row">
        <div class="col-md-6">
            <div class="container">
                <label for="trainerName" v-if="isGM==='true'">Game Master Name: </label>
                <label for="trainerName" v-else>Trainer Name: </label>
                <input type="text" name="trainerName" v-model="signUpName">
            </div>
            <div class="container">
                <label for="signUpPassword">Password: </label>
                <input type="password" name="signUpPassword" v-model="signUpPassword">
            </div>
            <div class="container">
                <label for="confirmUserPassword">Confirm Password: </label>
                <input type="password" name="confirmUserPassword" v-model="confirmUserPassword">
            </div>
            <div v-if="isGM==='true'">
                <div class="container">
                    <label for="gamePassword">Game Session Password: </label>
                    <input type="password" name="gamePassword" v-model="gamePassword">
                </div>
                <div class="container">
                    <label for="confirmGamePassword">Confirm Password: </label>
                    <input type="password" name="confirmGamePassword" v-model="confirmGamePassword">
                </div>
                <div class="container">
                    <label for="gameNickname">Game Nickname (optional): </label>
                    <input type="text" name="gameNickname" v-model="gameNickname">
                </div>
            </div>
            <div class="container my-2">
                <button class="btn btn-primary" @click="signUp">Sign up</button>
            </div>
        </div>
    </div>
</template>

<script>
import { addPlayerToGame, createNewGame } from '../../api/game.api';
import { areGameSignupCredentialsValid, areTrainerSignupCredentialsValid } from '../../utils/credentials'
import { setInitialCredentials, setTrainer } from '../../utils/localStorage';
import { generateErrorModal } from "../../utils/modalUtil";

export default {
    name: 'SignUp',
    props: {
        isGM: {
            default: false
        }
    },
    data(){
        return {
            gameId: null,
            signUpName: '',
            signUpPassword: '',
            confirmUserPassword: '',
            gamePassword: '',
            confirmGamePassword: '',
            gameNickname: '',
        }
    },
    mounted:function(){
        this.gameId = this.$route.query.gameId;
    },
    methods: {
        async signUp(){
            const trainerResult = await areTrainerSignupCredentialsValid(this.signUpName, this.signUpPassword, this.confirmUserPassword)
                .catch(generateErrorModal);
            if (!trainerResult){
                return
            }
            
            if (this.isGM === 'true'){
                const gameResult = await areGameSignupCredentialsValid(this.gamePassword, this.confirmGamePassword)
                    .catch(generateErrorModal);
                if (!gameResult){
                    return
                }
                
                await this.gmSignup()
                    .then(this.pushToNext)
                    .catch(generateErrorModal);
            }
            else {
                await this.trainerSignup()
                    .then(response => {
                        setTrainer(response.trainer);
                        this.pushToNext(response);
                    })
                    .catch(generateErrorModal);
            }
        },
        pushToNext(response){
            setInitialCredentials(response.trainer.trainerId, response, this.isGM === 'true');
            window.location.href = response.portal
        },
        async gmSignup(){
            return await createNewGame(this.signUpName, this.signUpPassword, this.gamePassword, this.gameNickname)
                .then(response => {
                    return {
                        portal: '/gm',
                        trainer: response.data.gameMaster,
                        headers: response.headers,
                        gameId: response.data.gameId
                    };
                });
        },
        async trainerSignup(){
            return await addPlayerToGame(this.gameId, this.signUpName, this.signUpPassword)
                .then(response => {
                    return {
                        portal: '/trainer',
                        trainer: response.data.trainer,
                        headers: response.headers,
                        gameId: this.gameId
                    };
                });
        }
    }
}
</script>
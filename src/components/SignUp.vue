<template>
    <h3>Sign Up</h3>
    <div class="row">
        <div class="col-md-6">
            <div>
                <label for="trainerName" v-if="isGM==='true'">Game Master Name: </label>
                <label for="trainerName" v-else>Trainer Name: </label>
                <input type="text" name="trainerName" v-model="signUpName">
            </div>
            <div>
                <label for="signUpPassword">Password: </label>
                <input type="password" name="signUpPassword" v-model="signUpPassword">
            </div>
            <div>
                <label for="confirmUserPassword">Confirm Password: </label>
                <input type="password" name="confirmUserPassword" v-model="confirmUserPassword">
            </div>
            <div v-if="isGM==='true'">
                <div>
                    <label for="gamePassword">Game Session Password: </label>
                    <input type="password" name="gamePassword" v-model="gamePassword">
                </div>
                <div>
                    <label for="confirmGamePassword">Confirm Password: </label>
                    <input type="password" name="confirmGamePassword" v-model="confirmGamePassword">
                </div>
            </div>
            <div>
                <button class="btn btn-primary" @click="signUp">Sign up</button>
            </div>
        </div>
    </div>
</template>

<script>
import { addPlayerToGame, createNewGame } from '../api/game.api';
import { areGameSignupCredentialsValid, areTrainerSignupCredentialsValid } from '../utils/credentials'
import { addToStorage } from '../utils/localStorage'

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
        }
    },
    mounted:function(){
        this.gameId = this.$route.query.gameId;
    },
    methods: {
        async signUp(){
            if (!areTrainerSignupCredentialsValid(this.signUpName, this.signUpPassword, this.confirmUserPassword)){
                return;
            }
            
            let response = {}
            if (this.isGM === 'true'){
                if (!areGameSignupCredentialsValid(this.gamePassword, this.confirmGamePassword)){
                    return;
                }
                
                response = await this.gmSignup()
            }
            else {
                response = await this.trainerSignup()
            }

            const options = {
                name: response.portal,
                params: {
                    trainerId: response.trainer.trainerId,
                    ptaActivityToken: response.headers['pta-activity-token'],
                    ptaSessionAuth: response.headers['pta-session-auth'],
                    isAuthenticated: true
                },
                query: {
                    gameId: response.gameId
                }
            }

            addToStorage({
                trainerId: response.trainer.trainerId,
                ptaActivityToken: response.headers['pta-activity-token'],
                ptaSessionAuth: response.headers['pta-session-auth'],
                isAuthenticated: true,
                gameId: response.gameId
            });

            this.$router.push(options);
        },
        async gmSignup(){
            const response = await createNewGame(this.signUpName, this.signUpPassword, this.gamePassword).catch(alert);
            if (response.status == 200){
                return {
                    portal: 'GM/Index',
                    trainer: response.data.gameMaster,
                    headers: response.headers,
                    gameId: response.data.gameId
                };
            }
        },
        async trainerSignup(){
            const response = await addPlayerToGame(this.gameId, this.signUpName, this.signUpPassword).catch(alert);
            if (response.status == 200){
                return {
                    portal: 'Trainer/Index',
                    trainer: response.data.trainer,
                    headers: response.headers,
                    gameId: this.gameId
                };
            }
        }
    }
}
</script>
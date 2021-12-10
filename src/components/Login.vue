<template>
    <h3>Log in</h3>
    <div class="row">
        <div class="col-md-6">
            <div>
                <label for="trainerName" v-if="isGM==='true'">Game Master Name: </label>
                <label for="trainerName" v-else>Trainer Name: </label>
                <input type="text" name="trainerName" v-model="trainerName">
            </div>
            <div>
                <label for="password">Password: </label>
                <input type="password" name="password" v-model="password">
            </div>
            <div v-if="isGM==='true'">
                <label for="gameSessionPassword" v-if="isGM==='true'">Game Session Password: </label>
                <input type="password" name="gameSessionPassword" v-model="gamePassword">
                <label for="gameSessionPassword" v-if="isGM==='true'">Game ID: </label>
                <input type="text" name="gameSessionPassword" v-model="gameId">
            </div>
            <div>
                <button class="btn btn-primary" @click="login">Sign in</button>
            </div>
        </div>
    </div>
</template>

<script>
import { startGame } from '../api/game.api';
import { areTrainerCredentialsValid, isGamePasswordValid } from '../utils/credentials';
import { setGameId, setIsAuthenticate, setIsGM, setPTAActivityToken, setSessionAuth, setTrainerId } from '../utils/localStorage';

export default {
    name: 'Login',
    props: {
        isGM: {
            default: false
        }
    },
    data(){
        return {
            gameId: null,
            trainerName: '',
            password: '',
            gamePassword: '',
        }
    },
    mounted:function(){
        this.gameId = this.$route.query.gameId;
    },
    methods: {
        async login(){
            if (!areTrainerCredentialsValid(this.trainerName, this.password)){
                return;
            }

            let response = {}
            let trainerId = ''            
            if (this.isGM){
                if (!isGamePasswordValid(this.gamePassword)){
                    return
                }
                
                response = await this.gmLogin()
                trainerId = response.trainers.filter(trainer => trainer.trainerName == this.trainerName)[0].trainerId
            }
            else {
                response = await this.trainerLogin()
                trainerId = response.trainer.trainerId
            }

            const options = {
                name: response.portal,
                query: {
                    gameId: response.gameId
                }
            }

            setTrainerId(trainerId);
            setPTAActivityToken(response.headers['pta-activity-token']);
            setSessionAuth(response.headers['pta-session-auth']);
            setIsAuthenticate(true);
            setGameId(response.gameId);
            setIsGM(this.isGM);

            this.$router.push(options);
            this.$router.go();
        },
        async gmLogin(){
            const response = await startGame(this.gameId, this.trainerName, this.password, this.gamePassword).catch(alert);
            if (response && response.status == 200){
                alert(JSON.stringify(response.data))
                return {
                    portal: 'GM/Index',
                    trainers: response.data.trainers,
                    headers: response.headers,
                    gameId: response.data.gameId
                };
            }
        },
        async trainerLogin(){
            // implement trainer.api module first
            // const response = await addPlayerToGame(this.gameId, username, password).catch(alert);
            const response = {}
            if (response && response.status == 200){
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
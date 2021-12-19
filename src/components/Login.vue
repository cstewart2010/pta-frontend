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
    import { userLogin } from '../api/trainer.api';
    import { areTrainerCredentialsValid, isGamePasswordValid } from '../utils/credentials';
    import { setInitialCredentials, setTrainer } from '../utils/localStorage';
    import { generateErrorModal } from "../utils/modalUtil"

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
                const trainerResult = await areTrainerCredentialsValid(this.trainerName, this.password)
                    .catch(generateErrorModal);
                if (!trainerResult){
                    return;
                }

                if (this.isGM === true){
                    const gameResult = await isGamePasswordValid(this.gamePassword)
                        .catch(generateErrorModal);
                    if (!gameResult){
                        return;
                    }
                    
                    await this.gmLogin()
                        .then(response => {
                            const trainerId = response.trainers.filter(trainer => trainer.trainerName == this.trainerName)[0].trainerId;
                            this.pushToNext(trainerId, response);
                        })
                        .catch(generateErrorModal);
                }
                else {
                    await this.trainerLogin()
                        .then(response => {
                            setTrainer(response.trainer);
                            const trainerId = response.trainer.trainerId
                            this.pushToNext(trainerId, response);
                        })
                        .catch(generateErrorModal);
                }
            },
            pushToNext(trainerId, response){
                const options = {
                    name: response.portal
                }

                setInitialCredentials(trainerId, response, this.isGM);
                this.$router.go(options);
            },
            async gmLogin(){
                return await startGame(this.gameId, this.trainerName, this.password, this.gamePassword)
                    .then(response => {
                        return {
                            portal: 'GM/Index',
                            trainers: response.data.trainers,
                            headers: response.headers,
                            gameId: response.data.gameId
                        }
                    });
            },
            async trainerLogin(){
                return await userLogin(this.gameId, this.trainerName, this.password)
                    .then(response => {
                        return {
                            portal: 'Trainer/Index',
                            trainer: response.data.trainer,
                            headers: response.headers,
                            gameId: this.gameId
                        }
                    });
            }
        }
    }
</script>
<template>
    <h3>Log in</h3>
    <div class="row">
        <div class="col-md-6">
            <div>
                <label for="trainerName" v-if="isGM==='true'">Game Master Name: </label>
                <label for="trainerName" v-else>Trainer Name: </label>
                <input type="text" name="trainerName" id="trainerName">
            </div>
            <div>
                <label for="password">Password: </label>
                <input type="password" name="password" id="password">
            </div>
            <div v-if="isGM==='true'">
                <label for="gameSessionPassword" v-if="isGM==='true'">Game Session Password: </label>
                <input type="text" name="gameSessionPassword" id="gameSessionPassword">
            </div>
            <div>
                <button class="btn btn-primary" @click="login">Sign in</button>
            </div>
        </div>
    </div>
</template>

<script>
import { addToStorage } from '../utils/localStorage';

export default {
    name: 'Login',
    props: {
        isGM: {
            default: false
        }
    },
    mounted:function(){
    },
    methods: {
        login(){
            const trainerName = document.getElementById("trainerName").value;
            const password = document.getElementById("password").value;
            if (!(trainerName && password && confirm)){
                alert("Please fill out all fields");
            }

            else if (trainerName.length < 6 || password.length < 6){
                alert("Trainer name and password must be at least 6 characters long");
            }
            
            else {
                // handle create new trainer
                alert("Success!");
                const params = {
                    trainerId: trainerName,
                    gameId: password,
                    ptaActivityToken: "test",
                    ptaSessionAuth: "test",
                }
                addToStorage(params)
                const folder = this.isGM ? 'GM' : 'Trainer'
                const options = {
                    name: `${folder}/Index`,
                    params
                }
                this.$router.push(options);
            }
        }
    }
}
</script>
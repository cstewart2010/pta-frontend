<template>
    <h3>Sign Up</h3>
    <div class="row">
        <div class="col-md-6">
            <div>
                <label for="trainerName" v-if="isGM==='true'">Game Master Name: </label>
                <label for="trainerName" v-else>Trainer Name: </label>
                <input type="text" name="trainerName" id="signUpName">
            </div>
            <div>
                <label for="signUpPassword">Password: </label>
                <input type="password" name="signUpPassword" id="signUpPassword">
            </div>
            <div>
                <label for="confirmUserPassword">Confirm Password: </label>
                <input type="password" name="confirmUserPassword" id="confirmUserPassword">
            </div>
            <div v-if="isGM==='true'">
                <div>
                    <label for="gamePassword">Game Session Password: </label>
                    <input type="password" name="gamePassword" id="gamePassword">
                </div>
                <div>
                    <label for="confirmGamePassword">Confirm Password: </label>
                    <input type="password" name="confirmGamePassword" id="confirmGamePassword">
                </div>
            </div>
            <div>
                <button class="btn btn-primary" @click="signUp">Sign up</button>
            </div>
        </div>
    </div>
</template>

<script>
import { addToStorage } from '../utils/localStorage';

export default {
    name: 'SignUp',
    props: {
        isGM: {
            default: false
        }
    },
    mounted:function(){
    },
    methods: {
        signUp(){
            const trainerName = document.getElementById("signUpName").value;
            const password = document.getElementById("signUpPassword").value;
            const confirm = document.getElementById("confirmUserPassword").value;
            if (!(trainerName && password && confirm)){
                alert("Please fill out all fields");
            }

            else if (password != confirm){
                alert("Passwords do not match");
            }

            else if (trainerName.length < 6 || password.length < 6){
                alert("Trainer name and password must be at least 6 characters long");
            }            
            else {
                // handle login for new character
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
<template>
    <h3>Sign Up</h3>
    <form @submit.prevent="signUp">
        <div class="input-group my-2">
            <span class="input-group-text">Username:</span>
            <input class="form-control" type="text" name="trainerName" v-model="signUpName">
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Password:</span>
            <input class="form-control" type="password" name="password" v-model="signUpPassword">
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Confirm Password:</span>
            <input class="form-control" type="password" name="confirmUserPassword" v-model="confirmUserPassword">
        </div>
        <button type="submit" class="btn btn-primary my-2">Sign up</button>
    </form>
</template>

<script>
import { createNewUser } from '../../api/user.api';
import { areTrainerSignupCredentialsValid } from '../../utils/credentials'
import { setInitialCredentials } from '../../utils/localStorage';
import { generateErrorModal } from "../../utils/modalUtil";

export default {
    name: 'SignUp',
    data(){
        return {
            signUpName: '',
            signUpPassword: '',
            confirmUserPassword: ''
        }
    },
    methods: {
        async signUp(){
            const trainerResult = await areTrainerSignupCredentialsValid(this.signUpName, this.signUpPassword, this.confirmUserPassword)
                .catch(generateErrorModal);
            if (!trainerResult){
                return
            }
            
            await createNewUser(this.signUpName, this.signUpPassword)
                .then(response => {
                    this.pushToNext(response.data.user, response.headers);
                })
                .catch(generateErrorModal);
        },
        pushToNext(user, headers){
            setInitialCredentials(user, headers);
            window.location.href = "/"
        }
    }
}
</script>
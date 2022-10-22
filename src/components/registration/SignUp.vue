<template>
    <h3 class="text-center">Sign Up</h3>
    <form class="row needs-validation" :id="formId" @submit.prevent="signUp" novalidate>
        <div class="col-md">
            <input id="username" class="form-control" placeholder="Username" type="text" name="trainerName" v-model="signUpName" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Username" />
        </div>
        <div class="col-md">
            <input id="password" class="form-control" placeholder="Password" type="password" name="password" v-model="signUpPassword" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Passowrd" />
        </div>
        <div class="col-md">
            <input id="confirm-password" class="form-control" placeholder="Confirm Password" type="password" name="confirmUserPassword" v-model="confirmUserPassword" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Confirm Password" />
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary my-2">Sign up</button>
        </div>
    </form>
</template>

<script>
import { createNewUser } from '../../api/user.api';
import { areTrainerSignupCredentialsValid, checkValidation } from '../../utils/credentials'
import { setInitialCredentials } from '../../utils/localStorage';
import { generateErrorModal } from "../../utils/modalUtil";
    import ValidationFeedback from "../partials/ValidationFeedback.vue"

export default {
    name: 'SignUp',
    data(){
        return {
            signUpName: '',
            signUpPassword: '',
            confirmUserPassword: '',
            formId: 'signup-form'
        }
    },
    components: {
        ValidationFeedback
    },
    methods: {
        async signUp(){
            if (!checkValidation(this.formId)){
                return;
            }
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
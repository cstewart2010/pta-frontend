<template>
    <h3 class="text-center">Log in</h3>
    <form class="row needs-validation" :id="formId" @submit.prevent="login" novalidate>
        <div class="col-md">
            <input id="username" class="form-control" placeholder="Username" type="text" name="trainerName" v-model="trainerName" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Username" />
        </div>
        <div class="col-md">
            <input id="password" class="form-control" placeholder="Password" type="password" name="password" v-model="password" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Password" />
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary my-2">Sign in</button>
        </div>
    </form>
</template>

<script>
    import { login } from '../../api/user.api';
    import { areTrainerCredentialsValid, checkValidation } from '../../utils/credentials';
    import { setInitialCredentials } from '../../utils/localStorage';
    import { generateErrorModal } from "../../utils/modalUtil"
    import ValidationFeedback from "../partials/ValidationFeedback.vue"

    export default {
        name: 'Login',
        data(){
            return {
                trainerName: '',
                password: '',
                formId: 'login-form'
            }
        },
        components: {
            ValidationFeedback
        },
        methods: {
            async login(){
                if (!checkValidation(this.formId)){
                    return;
                }
                const trainerResult = await areTrainerCredentialsValid(this.trainerName, this.password)
                    .catch(generateErrorModal);
                if (!trainerResult){
                    return;
                }

                await login(this.trainerName, this.password)
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
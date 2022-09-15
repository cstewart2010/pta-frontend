<template>
    <h3>Log in</h3>
    <form  @submit.prevent="login">
        <div class="input-group my-2">
            <span class="input-group-text">Username:</span>
            <input class="form-control" type="text" name="trainerName" v-model="trainerName">
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Password:</span>
            <input class="form-control" type="password" name="password" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary my-2">Sign in</button>
    </form>
</template>

<script>
    import { login } from '../../api/user.api';
    import { areTrainerCredentialsValid } from '../../utils/credentials';
    import { setInitialCredentials } from '../../utils/localStorage';
    import { generateErrorModal } from "../../utils/modalUtil"

    export default {
        name: 'Login',
        data(){
            return {
                trainerName: '',
                password: '',
            }
        },
        methods: {
            async login(){
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
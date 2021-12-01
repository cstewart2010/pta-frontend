<template>
    <div class="row">
        <h2 v-if="isGM==='true'" class="d-flex justify-content-end">Game Master Portal</h2>
        <h2 v-else class="justify-content-end">Trainer Portal</h2>
        <div class="row">
            <div class="row col-6">
                <Login v-bind:isGM="isGM" />
            </div>
            <div class="row col-6">
                <SignUp v-bind:isGM="isGM" />
            </div>
        </div>
    </div>
</template>

<script>
import Login from '../components/Login.vue';
import SignUp from '../components/SignUp.vue';
import { checkStorage } from '../utils/localStorage';

export default {
    name: 'Registration',
    props: {
        isGM: {
            default: false
        }
    },
    components: {
      Login,
      SignUp
    },
    mounted:function(){
        const result = checkStorage();
        if (!result.needsToAuthenticate){
            // validate trainer credentials

            alert(JSON.stringify(result));
            const folder = this.isGM ? 'GM' : 'Trainer'
            const options = {
                name: `${folder}/Index`,
                params: result
            }
            this.$router.push(options);
        }
    }
}
</script>
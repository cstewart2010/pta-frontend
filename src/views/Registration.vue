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
import Login from '../components/registration/Login.vue';
import SignUp from '../components/registration/SignUp.vue';
import { getIsAuthenticate } from '../utils/localStorage';

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
    beforeMount:function(){
        if (getIsAuthenticate()){
            // validate trainer credentials
            const folder = this.isGM ? 'gm' : 'trainer'
            this.$router.push(`/pta/${folder}`);
        }
    }
}
</script>
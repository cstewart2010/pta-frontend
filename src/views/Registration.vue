<template>
    <div class="row">
        <h2>User Portal</h2>
        <div class="row">
            <div class="col-6">
                <login />
            </div>
            <div class="col-6">
                <sign-up />
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
    components: {
      Login,
      SignUp
    },
    beforeMount:function(){
        if (getIsAuthenticate()){
            // validate trainer credentials
            this.$router.push(`/`);
        }
    }
}
</script>
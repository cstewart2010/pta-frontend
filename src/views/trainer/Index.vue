<template>
    {{trainer}}
</template>

<script>
import { getIsAuthenticate, getPTAActivityToken, getSessionAuth, getTrainer } from '../../utils/localStorage';

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: null,
            ptaActivityToken: null,
            ptaSessionAuth: null,
        }
    },
    beforeMount:function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        // validate trainer credentials
        this.trainer = getTrainer();
        this.ptaActivityToken = getPTAActivityToken();
        this.ptaSessionAuth = getSessionAuth();
    },
}
</script>

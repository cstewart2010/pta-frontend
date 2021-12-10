<template>
    {{gm}}
</template>

<script>
import { getIsAuthenticate, getPTAActivityToken, getSessionAuth, getTrainerId } from '../../utils/localStorage';

export default {
    name: 'GMPortal',
    data(){
        return {
            gm: null,
            ptaActivityToken: null,
            ptaSessionAuth: null,
        }
    },
    mounted:function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        // validate trainer credentials
        this.gm = getTrainerId();
        this.ptaActivityToken = getPTAActivityToken();
        this.ptaSessionAuth = getSessionAuth();
    },
}
</script>

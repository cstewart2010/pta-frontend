<template>
    
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name: 'Login',
    setup() {
        
    },
    data() {
        return {
            gameId: null,
            trainerId: null,
            ptaActivityToken: null,
            ptaSessionAuth: null,
            needsToAuthenticate: true
        }
    },
    mounted:function(){        
        const authString = window.localStorage.getItem("ptaAuthString");
        if (!authString){
            this.needsToAuthenticate = true
            return;
        }

        try {
            const auth = JSON.parse(authString);
            this.ptaActivityToken = auth.ptaActivityToken
            this.ptaSessionAuth = auth.ptaSessionAuth
            this.trainerId = auth.trainerId
            this.gameId = auth.gameId
            this.needsToAuthenticate = auth.needsToAuthenticate
            // authenticate trainer using api
            this.$router.push('/GameControl')
        }
        catch {
            this.needsToAuthenticate = true
        }
    }
})
</script>
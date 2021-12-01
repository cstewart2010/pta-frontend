<template>
    {{trainerId}}
</template>

<script>
import {checkStorage} from '../../utils/localStorage'

export default {
    name: 'GMPortal',
    props: {
        trainerId: null,
        gameId: null,
        ptaActivityToken: null,
        ptaSessionAuth: null,
    },
    mounted:function(){
        if (!(this.trainerId && this.gameId && this.ptaActivityToken && this.ptaSessionAuth)){
            const result = checkStorage();
            if (!result.needsToAuthenticate){
                // validate trainer credentials
                return
            }
            const options = {
                name: `Registration`,
                params: {
                    isGM: true
                }
            }
            this.$router.push(options);
        }
        
        // validate trainer credentials
    },
}
</script>

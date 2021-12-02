<template>
    {{trainerId}}
</template>

<script>
import {checkStorage} from '../../utils/localStorage'

export default {
    name: 'TrainerPortal',
    props: {
        trainerId: null,
        ptaActivityToken: null,
        ptaSessionAuth: null,
    },
    mounted:function(){
        if (!(this.trainerId && this.ptaActivityToken && this.ptaSessionAuth)){
            const result = checkStorage();
            if (!result.needsToAuthenticate){
                // validate trainer credentials
                return
            }
            const options = {
                name: `Registration`,
                params: {
                    isGM: false
                }
            }
            this.$router.push(options);
        }
        
        // validate trainer credentials
    },
}
</script>

<template>
    {{trainer}}
</template>

<script>
import {getDataFromStorage} from '../../utils/localStorage'

export default {
    name: 'TrainerPortal',
    props: {
        trainerId: null,
        ptaActivityToken: null,
        ptaSessionAuth: null,
    },
    data(){
        return {
            trainer: null
        }
    },
    mounted:function(){
        if (!(this.trainerId && this.ptaActivityToken && this.ptaSessionAuth)){
            const result = getDataFromStorage();
            if (!result.needsToAuthenticate){
                // validate trainer credentials
                this.trainer = result.trainerId;
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
        
        this.trainer = this.trainerId;
        // validate trainer credentials
    },
}
</script>

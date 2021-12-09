<template>
    {{gm}}
</template>

<script>
import {getDataFromStorage} from '../../utils/localStorage'

export default {
    name: 'GMPortal',
    props: {
        trainerId: null,
        ptaActivityToken: null,
        ptaSessionAuth: null,
    },
    data(){
        return {
            gm: null
        }
    },
    mounted:function(){
        if (!(this.trainerId && this.ptaActivityToken && this.ptaSessionAuth)){
            const result = getDataFromStorage();
            if (!result.needsToAuthenticate){
                // validate trainer credentials
                this.gm = result.trainerId
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
        
        this.gm = this.trainerId
        // validate trainer credentials
    },
}
</script>

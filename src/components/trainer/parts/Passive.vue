<template>    
    <div class="col-md-2">
        {{passive.name}}
    </div>
    <div class="col-md-10">
        {{passive.effects}}
    </div>
    <hr class="my-2">
</template>

<script>
import { getPassiveFeature } from '../../../api/dex.api'
export default {
    name: 'Passive',
    props: {
        passiveName: {
            default: 'Growl'
        }
    },
    data(){
        return {
            passive: {}
        }
    },
    beforeMount: async function() {
        await getPassiveFeature(this.passiveName)
            .then(response => {
                this.passive = response.data
            })
    }
}
</script>
<template>    
    <div class="col-4 text-truncate" data-bs-toggle="tooltip" :title="passive.name">
        {{passive.name}}
    </div>
    <div class="col-8">
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
    async beforeMount() {
        await getPassiveFeature(this.passiveName)
            .then(response => {
                this.passive = response.data
            })
    }
}
</script>
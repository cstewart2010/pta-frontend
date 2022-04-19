<template>    
    <div class="row">
        <div class="col-md-6">
            <div class="text-center">Physical Description</div>
            <div class="text-center">
                {{trainer.description}}
            </div>
            <div class="text-center">Personality</div>
            <div class="text-center">
                {{trainer.personality}}
            </div>
        </div>
        <div class="col-md-6">
            <div class="text-center">Background</div>
            <div class="text-center">
                {{trainer.background}}
            </div>
            <div class="text-center">Goals / Dreams / Obsessions</div>
            <div class="text-center">
                {{trainer.goals}}
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: "Bottom",
    props: {
        trainerId: {
            default: ''
        }
    },
    data(){
        return {
            trainer: {}
        }
    },
    beforeMount(){
        this.trainer = getCellParticipant(this.trainerId)
    }
}
</script>
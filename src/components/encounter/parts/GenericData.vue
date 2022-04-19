<template>
    <div class="row">
        <div class="col-2">
            <div class="text-center">Name</div>
            <div class="text-center">
                {{trainer.trainerName.toUpperCase()}}
            </div>
        </div>
        <div class="col-2">
            <div class="text-center">Species</div>
            <div class="text-center">
                {{trainer.species}}
            </div>
        </div>
        <div class="col-2">
            <div class="text-center">Age</div>
            <div class="text-center">
                {{trainer.age}} yo
            </div>
        </div>
        <div class="col-2">
            <div class="text-center">Gender</div>
            <div class="text-center">
                {{trainer.gender}}
            </div>
        </div>
        <div class="col-2">
            <div class="text-center">Height</div>
            <div class="text-center">
                {{trainer.height}}
            </div>
        </div>
        <div class="col-2">
            <div class="text-center">Weight</div>
            <div class="text-center">
                {{trainer.weight}}
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: "GenericData",
    props: {
        trainerId: {
            default: ''
        }
    },
    data(){
        return {
            trainer: {
                trainerName: ""
            }
        }
    },
    beforeMount(){
        this.trainer = getCellParticipant(this.trainerId)
    }
}
</script>
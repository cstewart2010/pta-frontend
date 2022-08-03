<template>
    <div v-if="isGM || trainerId == currentTrainerId">
        <div class="row">
            <div class="col-md-8">
                <generic-data :trainerId="trainerId" />
                <trainer-stats :trainerId="trainerId" />
                <trainer-skills :trainerId="trainerId" />
            </div>
            <portrait :trainerId="trainerId" />
        </div>
        <hr>
        <bottom :trainerId="trainerId" />
    </div>
    <div v-else>
        <div class="row">
            <generic-data :trainerId="trainerId" />
        </div>
        <div class="d-flex justify-content-center">
            <portrait :trainerId="trainerId" />
        </div>
    </div>
</template>

<script>
import GenericData from './parts/GenericData.vue'
import TrainerSkills from './parts/TrainerSkills.vue'
import Portrait from './parts/Portrait.vue'
import TrainerStats from './parts/TrainerStats.vue'
import Bottom from './parts/Bottom.vue'
import { getIsGM, getTrainerId } from '../../utils/localStorage'

export default {
    name: "TrainerSheet",
    props: {
        trainerId: {
            default: ''
        }
    },
    data(){
        return {
            isGM: getIsGM(),
            currentTrainerId: getTrainerId()
        }
    },
    components: {
        GenericData,
        TrainerStats,
        TrainerSkills,
        Portrait,
        Bottom
    }
}
</script>
<template>
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
</template>

<script>
import GenericData from './parts/GenericData.vue'
import TrainerSkills from './parts/TrainerSkills.vue'
import Portrait from './parts/Portrait.vue'
import TrainerStats from './parts/TrainerStats.vue'
import Bottom from './parts/Bottom.vue'

export default {
    name: "TrainerSheet",
    props: {
        trainerId: {
            default: ''
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
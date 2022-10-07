<template>
    <div class="row">
        <div class="col-md-7">
            <generic-data />
            <trainer-stats />
            <trainer-skills />
        </div>
        <portrait />
    </div>
</template>

<script>
import GenericData from './GenericData.vue'
import Portrait from './Portrait.vue'
import TrainerStats from './TrainerStats.vue'
import TrainerSkills from './TrainerSkills.vue'

export default {
    name: "Left",
    components: {
        GenericData,
        Portrait,
        TrainerStats,
        TrainerSkills,
    }
}
</script>
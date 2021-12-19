<template>
    <div class="col-md-11">
        <div class="row">
            <div class="col-md-8">
                <generic-data />
                <trainer-stats />
                <trainer-skills />
            </div>
            <portrait />
        </div>
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
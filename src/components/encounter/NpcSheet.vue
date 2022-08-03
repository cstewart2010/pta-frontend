<template>
    <div v-if="gameId">
        <div class="row">
            <div class="col-md-8">
                <generic-data :npcId="npcId" />
                <trainer-stats :trainerId="npcId" />
                <trainer-skills :trainerId="npcId" />
            </div>
            <portrait :npcId="npcId" />
        </div>
        <hr>
        <bottom :trainerId="npcId" />
    </div>
    <div class="d-flex justify-content-center" v-else>
        <portrait :npcId="npcId" />
    </div>
</template>

<script>
import { getIsGM } from '../../utils/localStorage'
import Bottom from './parts/Bottom.vue'
import GenericData from './parts/NpcGenericData.vue'
import Portrait from './parts/NpcPortrait.vue'
import TrainerSkills from './parts/TrainerSkills.vue'
import TrainerStats from './parts/TrainerStats.vue'

export default {
    name: "TrainerSheet",
    props: {
        npcId: {
            default: ''
        }
    },
    data(){
        return {
            gameId: getIsGM()
        }
    },
    components: {
        Bottom,
        GenericData,
        Portrait,
        TrainerSkills,
        TrainerStats
    }
}
</script>
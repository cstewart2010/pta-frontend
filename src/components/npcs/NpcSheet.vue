<template>
    <div class="row">
        <div class="col-md-8">
            <generic-data :npcId="npcId" />
            <trainer-stats :npcId="npcId"/>
            <trainer-skills :npcId="npcId"/>
        </div>
        <portrait :npcId="npcId"/>                                                                      
    </div>
     <hr>
    <bottom :npcId="npcId"/>
</template>

<script>
import GenericData from './GenericData.vue'
import Portrait from './Portrait.vue'
import TrainerStats from './TrainerStats.vue'
import TrainerSkills from './TrainerSkills.vue'
import Bottom from './Bottom.vue'
export default {
    name: "Npc",
    props: {
        npcId:{
            default: null
        }
    },
    components: {
        GenericData,
        Portrait,
        TrainerStats,
        TrainerSkills,
        Bottom
    }
}
</script>
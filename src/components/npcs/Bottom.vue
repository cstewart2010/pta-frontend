<template>    
    <div class="row">
        <div class="col-md-6">
            <div class="text-center">Physical Description</div>
            <textarea v-model="description" class="form-control" @input="updateTrainer('description', description)" />
            <div class="text-center">Personality</div>
            <textarea v-model="personality" class="form-control" @input="updateTrainer('personality', personality)" />
        </div>
        <div class="col-md-6">
            <div class="text-center">Background</div>
            <textarea v-model="background" class="form-control" @input="updateTrainer('background', background)" />
            <div class="text-center">Goals / Dreams / Obsessions</div>
            <textarea v-model="goals" class="form-control" @input="updateTrainer('goals', goals)" />
        </div>
    </div>
    <hr>
</template>

<script>
import { getNpc, setNpc } from '../../utils/localStorage';

export default {
    name: "Bottom",
    data(){
        return {
            description: "",
            personality: "",
            background: "",
            goals: ""
        }
    },
     props: {
        npcId: {
            default: null
        }

    },
    beforeMount: function(){
        const npc = getNpc(this.npcId);
        if (npc){
            this.description = npc.description;
            this.personality = npc.personality;
            this.background = npc.background;
            this.goals = npc.goals;
        }
    },
    methods:{
       updateTrainer(section, value){
            const npc = getNpc(this.npcId);
            if(npc){
                npc[section] = value;
               setNpc(npc);
            }
        }
    }
}
</script>
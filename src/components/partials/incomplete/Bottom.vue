<template>    
    <div class="row">
        <div class="col-md-6">
            <div class="text-center">Physical Description</div>
            <textarea v-model="description" class="w-100" @input="updateTrainer('description', description)" />
            <div class="text-center">Personality</div>
            <textarea v-model="personality" class="w-100" @input="updateTrainer('personality', personality)" />
        </div>
        <div class="col-md-6">
            <div class="text-center">Background</div>
            <textarea v-model="background" class="w-100" @input="updateTrainer('background', background)" />
            <div class="text-center">Goals / Dreams / Obsessions</div>
            <textarea v-model="goals" class="w-100" @input="updateTrainer('goals', goals)" />
        </div>
    </div>
    <hr>
</template>

<script>
import { getTrainer, setTrainer } from '../../../utils/localStorage';

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
    beforeMount: function(){
        const trainer = getTrainer();
        this.description = trainer.description;
        this.personality = trainer.personality;
        this.background = trainer.background;
        this.goals = trainer.goals;
    },
    methods:{
        updateTrainer(section, value){
            const trainer = getTrainer()
            trainer[section] = value;
            setTrainer(trainer);
        }
    }
}
</script>
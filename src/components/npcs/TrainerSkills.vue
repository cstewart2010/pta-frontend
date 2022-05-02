<template>
    <div class="row">
        <div class="text-center">Skills</div>
        <div class="col-12 col-6">
            <div class="row d-flex align-items-center">
                <div class="col text-center">Skill Name</div>
                <div class="col text-center">Talent 1</div>
                <div class="col text-center">Talent 2</div>
                <div class="col text-center">Modifier</div>
            </div>
            <div class="row d-flex align-items-center" v-for="(trainerSkill, index) in trainerSkills" :key="index">
                <button class="col col-3 btn btn-dark pl-2 text-truncate" data-bs-toggle="tooltip" :title="trainerSkill.name" @click="sendLog(trainerSkill.name)">{{trainerSkill.name}}</button>
                <div class="col col-3" style="text-align:center;">
                    <input type="checkbox" :name="trainerSkill.name+'-talent-1'" :id="trainerSkill.name+'-talent-1'" :checked="trainerSkills[index].talent1" @change="updateTalent1(index)">
                </div>
                <div class="col col-3" style="text-align:center;">
                    <input type="checkbox" :name="trainerSkill.name+'-talent-2'" :id="trainerSkill.name+'-talent-2'" :checked="trainerSkills[index].talent2" @change="updateTalent2(index)">
                </div>
                <div class="col col-3" style="text-align:center;" :id="trainerSkill.name+'-modifier'">
                    <div v-if="trainerSkills[index].talent1 ^ trainerSkills[index].talent2">
                        +{{Math.floor(trainerStats[trainerSkill.modifierStat]/2) + 2}}
                    </div>
                    <div v-else-if="trainerSkills[index].talent1">
                        +{{Math.floor(trainerStats[trainerSkill.modifierStat]/2) + 5}}
                    </div>
                    <div v-else-if="trainerStats[trainerSkill.modifierStat] > 1">
                        +{{Math.floor(trainerStats[trainerSkill.modifierStat]/2)}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { postLog } from '../../api/game.api';
import { getNpc, setPTAActivityToken, setNpc } from '../../utils/localStorage'

export default {
    name: "NpcSkills",
    data() {
        return {
            trainerSkills: {},
            trainerStats: {},
            isComplete: false,
            trainerName: ''
        }
    },
    props: {
        npcId: {
            default: null
        }
    },
    beforeMount: async function(){     
        const npc = getNpc(this.npcId);
        this.trainerName = npc.trainerName;
        this.trainerSkills = npc.trainerSkills
        this.trainerStats = npc.trainerStats
        this.isComplete = npc.isComplete
    },
    methods: {
        updateTalent1(index){
            this.trainerSkills[index].talent1 = !this.trainerSkills[index].talent1
            this.updateTrainer('trainerSkills', this.trainerSkills);
        },
        updateTalent2(index){
            this.trainerSkills[index].talent2 = !this.trainerSkills[index].talent2
            this.updateTrainer('trainerSkills', this.trainerSkills);
        },
        updateTrainer(section, value){
            const npc = getNpc(this.npcId);
            if(npc){
                npc[section] = value;
               setNpc(npc);
            }
        },
        async sendLog(skillName){
            var modifierValue = document.getElementById(`${skillName}-modifier`).textContent;
            var modifier = modifierValue.length > 0 ? ` with a ${modifierValue} modifier` : '';
            await postLog({
                User: this.trainerName,
                Action: `performed a ${skillName} roll of ${Math.ceil(Math.random()*20)}${modifier}`
            })
            .then(response => {
                setPTAActivityToken(response.headers['pta-activity-token']);
            })

        }
    }
}
</script>
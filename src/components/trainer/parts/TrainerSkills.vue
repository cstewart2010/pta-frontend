<template>
    <div class="row">
        <div class="col-6">
            <div class="text-center">Skills</div>
        </div>
        <div class="col-6">
            <select class="form-select text-center" name="origin" v-model="selectedOrigin" @change="updateOrigin" :disabled="isComplete">
                <option value=""></option>
                <option v-for="(origin, index) in origins" :key="index" :id="origin" :value="origin.replace('/', '_')">
                    {{origin}}
                </option>
            </select>
        </div>
    </div>
    <hr>
    <div class="row">
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
        <hr>
        <div class="col-12 col-6">
            <div class="text-center">{{selectedOrigin}} Specialty</div>
            <div class="text-center">
                <p>Starting Equipment: {{originData.equipment}}</p>
                <p>Starting pokemon: {{originData.startingPokemon}}</p>
                <div v-if="originData.feature">
                    <p>Origin Feature: {{originData.feature.name}}</p>
                    <p>{{originData.feature.effects}}</p>
                    <p>
                        Starting Savings: {{money}}¥
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAllOrigins, getOrigin, } from '../../../api/dex.api';
import { postLog } from '../../../api/game.api';
import { getTrainer, setPTAActivityToken, setTrainer } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil';

export default {
    name: "TrainerSkills",
    data() {
        return {
            origins: [],
            selectedOrigin: '',
            originData: {},
            money: 0,
            trainerSkills: {},
            trainerStats: {},
            isComplete: false,
            trainerName: ''
        }
    },
    beforeMount: async function(){     
        await getAllOrigins()
            .then(response => {
                this.origins = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);

        const trainer = getTrainer();
        this.trainerName = trainer.trainerName;
        this.selectedOrigin = trainer.origin
        this.money = trainer.money
        this.trainerSkills = trainer.trainerSkills
        this.trainerStats = trainer.trainerStats
        this.isComplete = trainer.isComplete
        await this.updateOrigin();
    },
    methods: {
        async updateOrigin(){
            if (this.selectedOrigin.length > 0){
                await getOrigin(this.selectedOrigin.replace('/', '_'))
                    .then(response => {
                        this.updateTrainer('origin', this.selectedOrigin);
                        this.money = response.data.savings;
                        this.originData = response.data
                        this.updateTrainer('money', this.money);
                    })
                    .catch(generateErrorModal);
            }
            else {
                this.updateTrainer('origin', this.selectedOrigin);
                this.money = 0;
                this.originData = ''
                this.updateTrainer('money', this.money);
            }
        },
        updateTalent1(index){
            this.trainerSkills[index].talent1 = !this.trainerSkills[index].talent1
            this.updateTrainer('trainerSkills', this.trainerSkills);
        },
        updateTalent2(index){
            this.trainerSkills[index].talent2 = !this.trainerSkills[index].talent2
            this.updateTrainer('trainerSkills', this.trainerSkills);
        },
        updateTrainer(section, value){
            const trainer = getTrainer()
            this.trainerStats = trainer.trainerStats
            trainer[section] = value;
            setTrainer(trainer);
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
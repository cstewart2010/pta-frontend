<template>
    <div class="row">
        <div class="col-md-6">
            <div class="text-center">Skills</div>
        </div>
        <div class="col-md-6" v-if="isComplete">
            {{selectedOrigin}}
        </div>
        <div class="col-md-6" v-else>
            <select class="form-select text-center" name="origin" v-model="selectedOrigin" @change="updateOrigin">
                <option v-for="(origin, index) in origins" :key="index" :id="origin" :value="origin.replace('/', '_')">
                    {{origin}}
                </option>
            </select>
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-md-6">
            <div class="row d-flex align-items-center">
                <div class="col-md-3">Skill Name</div>
                <div class="col-md-3">Talent 1</div>
                <div class="col-md-3">Talent 2</div>
                <div class="col-md-3">Modifier</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="text-center">{{selectedOrigin}} Specialty</div>
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-md-6">
            <div class="row d-flex align-items-center" v-for="(trainerSkill, index) in trainerSkills" :key="index">
                <div class="col-md-3 pl-2 text-truncate" data-bs-toggle="tooltip" :title="trainerSkill.name">{{trainerSkill.name}}</div>
                <div class="col-md-3" style="text-align:center;">
                    <input type="checkbox" :name="trainerSkill.name+'-talent-1'" :id="trainerSkill.name+'-talent-1'" :checked="trainerSkills[index].talent1" @change="updateTalent1(index)">
                </div>
                <div class="col-md-3" style="text-align:center;">
                    <input type="checkbox" :name="trainerSkill.name+'-talent-2'" :id="trainerSkill.name+'-talent-2'" :checked="trainerSkills[index].talent2" @change="updateTalent2(index)">
                </div>
                <div class="col-md-3" style="text-align:center;">
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
        <div class="col-md-6 my-auto">
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
import { getTrainer, setTrainer } from '../../../utils/localStorage'
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
            isComplete: false
        }
    },
    beforeMount: async function(){     
        await getAllOrigins()
            .then(response => {
                this.origins = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);

        const trainer = getTrainer();
        this.selectedOrigin = trainer.origin
        this.money = trainer.money
        this.trainerSkills = trainer.trainerSkills
        this.trainerStats = trainer.trainerStats
        this.isComplete = trainer.isComplete
        await this.updateOrigin();
    },
    methods: {
        async updateOrigin(){
            if (this.selectedOrigin){
                await getOrigin(this.selectedOrigin.replace('/', '_'))
                    .then(response => {
                        this.updateTrainer('origin', this.selectedOrigin);
                        this.money = response.data.savings;
                        this.originData = response.data
                        this.updateTrainer('money', this.money);
                    })
                    .catch(generateErrorModal);
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
        }
    }
}
</script>
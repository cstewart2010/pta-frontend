<template>
    <div class="row">
        <div class="col-10 text-center">
            Stats
        </div>
        <div class="col-2 text-center">
            Classes
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-10 my-auto">
            <div class="row d-flex align-items-center">
                <div class="col-2">
                    <div class="text-center">Current HP</div>
                    <input class="w-100" type="number" :min="-trainerStats.hp" :max="trainerStats.hp" v-model="hp" @change="updateTrainerHP">
                    <div class="text-center">Max HP: {{trainerStats.hp}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Attack</div>
                    <input class="w-100" type="number" min="1" max="10" v-model="trainerStats.attack" @change="updateTrainer('trainerStats', trainerStats)">
                    <div>+{{Math.floor(trainerStats.attack/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Defense</div>
                    <input class="w-100" type="number" min="1" max="10" v-model="trainerStats.defense" @change="updateTrainer('trainerStats', trainerStats)">
                    <div>+{{Math.floor(trainerStats.defense/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>S. Attack</div>
                    <input class="w-100" type="number" min="1" max="10" v-model="trainerStats.specialAttack" @change="updateTrainer('trainerStats', trainerStats)">
                    <div>+{{Math.floor(trainerStats.specialAttack/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>S. Defense</div>
                    <input class="w-100" type="number" min="1" max="10" v-model="trainerStats.specialDefense" @change="updateTrainer('trainerStats', trainerStats)">
                    <div>+{{Math.floor(trainerStats.specialDefense/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Speed</div>
                    <input class="w-100" type="number" min="1" max="10" v-model="trainerStats.speed" @change="updateTrainer('trainerStats', trainerStats)">
                    <div>+{{Math.floor(trainerStats.speed/2)}}</div>
                </div>
            </div>
        </div>
        <div class="col-2 my-auto">
            <select class="form-select" v-model="selectedTrainerClasses[0]" @change="updateClass(0)">
                <option value=""></option>
                <option v-for="(trainerClass, index) in trainerClasses" :key="index" :id="trainerClass" :value="trainerClass.replace('/', '_')">
                    {{trainerClass}}
                </option>
            </select>
            <select class="form-select" v-model="selectedTrainerClasses[1]" @change="updateClass(1)">
                <option value=""></option>
                <option v-for="(trainerClass, index) in trainerClasses" :key="index" :id="trainerClass" :value="trainerClass.replace('/', '_')">
                    {{trainerClass}}
                </option>
            </select>
            <select class="form-select" v-model="selectedTrainerClasses[2]" @change="updateClass(2)">
                <option value=""></option>
                <option v-for="(trainerClass, index) in trainerClasses" :key="index" :id="trainerClass" :value="trainerClass.replace('/', '_')">
                    {{trainerClass}}
                </option>
            </select>
            <select class="form-select" v-model="selectedTrainerClasses[3]" @change="updateClass(3)">
                <option value=""></option>
                <option v-for="(trainerClass, index) in trainerClasses" :key="index" :id="trainerClass" :value="trainerClass.replace('/', '_')">
                    {{trainerClass}}
                </option>
            </select>
        </div>
    </div>
    <hr>
</template>

<script>
import { getAllTrainerClasses, getTrainerClass } from '../../../api/dex.api';
import { getCurrentHP, getTrainer, setCurrentHP, setTrainer } from '../../../utils/localStorage';
import { generateErrorModal } from '../../../utils/modalUtil';
export default {
    name: 'TrainerStats',
    data(){
        return {            
            trainerClasses: [''],
            trainerStats: {},
            hp: 0,
            selectedTrainerClasses: [],
        }
    },
    beforeMount: async function(){
        await getAllTrainerClasses()
            .then(response => {
                this.trainerClasses = response.data.results.map(item => item.name)
                this.trainerClasses.push('')
            })
            .catch(generateErrorModal);

        const trainer = getTrainer();
        this.trainerStats = trainer.trainerStats;
        this.hp = getCurrentHP() || this.trainerStats.hp
        this.selectedTrainerClasses = trainer.trainerClasses
    },
    methods: {        
        async updateClass(index){
            if (!this.isNullOrEmpty(this.selectedTrainerClasses[index])){
                await getTrainerClass(this.selectedTrainerClasses[index])
                    .then(() => {
                        this.updateTrainer('trainerClasses', this.selectedTrainerClasses);
                    })
                    .catch(generateErrorModal);
            }
        },
        updateTrainer(section, value){
            const trainer = getTrainer()
            trainer[section] = value;
            setTrainer(trainer);
        },
        updateTrainerHP(){
            setCurrentHP(this.hp);
        },
        isNullOrEmpty(value){
            value == null || value.length == 0;
        }
    }
}
</script>
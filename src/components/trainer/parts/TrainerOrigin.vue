<template>
    <div class="row text-center">
        <div class="col-12 mb-2" v-if="!trainer.isComplete || isGM">
            <div class="input-group">
                <span class="input-group-text">Origin</span>
                <select class="form-select" name="origin" v-model="selectedOrigin" @change="updateOrigin">
                    <option value=""></option>
                    <option v-for="(origin, index) in origins" :key="index" :id="origin" :value="origin.replace('/', '_')">
                        {{origin}}
                    </option>
                </select>
            </div>
        </div>
        <div class="col-12" v-if="selectedOrigin">
            <div>{{selectedOrigin}} Specialty</div>
            <div>
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
import { getAllOrigins, getOrigin } from '../../../api/dex.api';
import { getIsGM, getTrainer, setTrainer } from '../../../utils/localStorage';
import { generateErrorModal } from '../../../utils/modalUtil';
export default {
    name: 'TrainerOrigin',
    data(){
        return {
            origins: [],
            selectedOrigin: '',
            originData: {},
            money: 0,
            trainer: getTrainer(),
            isComplete: false,
            isGM: getIsGM()
        }
    },
    async beforeMount(){
        await getAllOrigins()
            .then(response => {
                this.origins = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);

        this.selectedOrigin = this.trainer.origin
        this.money = this.trainer.money
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
        updateTrainer(section, value){
            const trainer = getTrainer()
            this.trainerStats = trainer.trainerStats
            trainer[section] = value;
            setTrainer(trainer);
        }
    }
}
</script>
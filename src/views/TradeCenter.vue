<template>
    <div v-if="leftPokemonId==null">
        <div v-if="selectedTrainer==null">
            <h5 class="text-center">Pick a trainer</h5>
            <div class="row justify-content-around">
                <div class="col-5" v-for="trainer in trainers.filter(trainer => !trainer.isGM)" :key="trainer.trainerId">
                    <button class="btn btn-secondary my-1" @click="pickTrainer(trainer)">
                        {{trainer.trainerName}}
                    </button>
                </div>
            </div>
        </div>
        <div v-else-if="selectedPokemon==null">
            <h5 class="text-center">Pick a pokemon</h5>
            <div class="row justify-content-around">
                <div class="col-5" v-for="pokemon in pokemonCol" :key="pokemon.pokemonId">
                    <button class="btn btn-secondary my-1" @click="pickPokemon(pokemon.pokemonId, true)">
                        {{pokemon.nickname}} ({{pokemon.pokemonId}})
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="rightPokemonId==null">
        <div v-if="selectedTrainer==null">
            <h5 class="text-center">Pick another trainer</h5>
            <div class="row justify-content-around">
                <div class="col-5" v-for="trainer in trainers.filter(trainer => !trainer.isGM)" :key="trainer.trainerId">
                    <button class="btn btn-secondary my-1" @click="pickTrainer(trainer)">
                        {{trainer.trainerName}}
                    </button>
                </div>
            </div>
        </div>
        <div v-else-if="selectedPokemon==null">
            <h5 class="text-center">Pick another pokemon</h5>
            <div class="row justify-content-around">
                <div class="col-5" v-for="pokemon in pokemonCol" :key="pokemon.pokemonId">
                    <button class="btn btn-secondary my-1" @click="pickPokemon(pokemon.pokemonId, false)">
                        {{pokemon.nickname}} ({{pokemon.pokemonId}})
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>

        <button class="btn btn-success my-2" @click="trade()">Test</button>
    </div>
</template>

<script>
import { tradePokemon } from '../api/pokemon.api';
import { getTrainers, setPTAActivityToken, setTrainerId } from '../utils/localStorage'
import { generateErrorModal } from '../utils/modalUtil';
export default {
    name: "TradeCenter",
    data(){
        return {
            leftPokemonId: null,
            rightPokemonId: null,
            selectedTrainer: null,
            pokemonCol: [],
            selectedPokemon: null,
            trainers: getTrainers()
        }
    },
    beforeMount: function(){
        setTrainerId(this.trainers.filter(trainer => trainer.isGM)[0].trainerId);
    },
    methods: {
        pickTrainer(trainer){
            this.selectedTrainer = trainer;
            this.trainers = this.trainers.filter(x => x.trainerId != trainer.trainerId);
            this.pokemonCol = trainer.pokemonTeam.concat(trainer.pokemonHome);
            this.selectedPokemon = null
        },
        pickPokemon(pokemonId, isLeft){
            if (isLeft){
                this.leftPokemonId = pokemonId;
            }
            else{
                this.rightPokemonId = pokemonId;
            }
            this.pokemonCol = [];
            this.selectedPokemon = pokemonId;
            this.selectedTrainer = null;
        },
        async trade(){
            await tradePokemon(this.leftPokemonId, this.rightPokemonId)
                .then(response => {
                    setPTAActivityToken(response.headers["pta-activity-token"]);
                    location.href = "/gm";
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
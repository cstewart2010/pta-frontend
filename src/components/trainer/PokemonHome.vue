<template>
    <div class="text-center">
        <h3>Pokemon Home</h3>
        <hr/>
        <div id="pokemonTeam" class="my-1">
            <div class="d-flex flex-wrap flex-row justify-content-evenly">
                <div v-for="(pokemon, index) in actualHome" :key="pokemon">
                    <div class="row d-flex align-items-center" :id="'pokemon-'+index">
                        <actual-pokemon :pokemonId="pokemon.pokemonId" :trainerId="trainer.trainerId" :position="index + 1" />
                        <div class="col-1">
                            <button class="btn-close" @click="removeActual(index)" />
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
        <div id="addedPokemon" class="my-1 ">
            <div class="d-flex flex-wrap flex-row justify-content-evenly">
                <div class="row align-items-center" :id="'pokemon-'+index" v-for="(pokemon, index) in pokemonHome" :key="pokemon">
                    <added-pokemon :pokemon="pokemon" :isOnActiveTeam="false" :position="index + 1" />
                    <div class="col-1">
                        <button class="btn-close" @click="remove(index)" />
                    </div>
                </div>
                <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col-3">
                <select class="form-select my-1" name="pokemon" v-model="addedPokemon">
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon" :value="index + 1">
                        {{pokemon}}
                    </option>
                </select>
                <button class="btn btn-primary my-1" @click="addPokemon">Add this pokemon</button>
            </div>
        </div>
    </div>
</template>

<script>
import { getAllPokemon } from '../../api/dex.api'
import { deletePokemon, getGamePokemon } from '../../api/pokemon.api';
import { getPokemonNewHome, getTrainer, setPokemonNewHome, setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from './parts/AddedPokemon.vue';
import ActualPokemon from './parts/ActualPokemon.vue';

export default {
    name: 'PokemonHome',
    data(){
        return {
            trainer: getTrainer(),
            pokemonCol: [],
            pokemonHome: [],
            actualHome: [],
            addedPokemon: '',
        }
    },
    components:{
        AddedPokemon,
        ActualPokemon
    },
    beforeMount:async function(){
        await getAllPokemon()
            .then(response => {
                this.pokemonCol = response.data.results.map(item => item.name)
                const pokemonHome = getPokemonNewHome();
                if (pokemonHome){
                    this.pokemonHome = pokemonHome;
                }
            })
            .catch(generateErrorModal);
        this.trainer.pokemonHome
            .map(async pokemon => await getGamePokemon(pokemon.pokemonId).then(response => {
                this.actualHome.push(response.data)
            }) )
    },
    methods:{
        addPokemon(){
            this.pokemonHome.push({
                    speciesName: this.pokemonCol[this.addedPokemon - 1],
                    nickname: this.pokemonCol[this.addedPokemon - 1],
                    isOnActiveTeam: false
                });
            this.updateHome();
        },
        remove(index){
            this.pokemonHome = this.pokemonHome.filter((pokemon, entryIndex) => entryIndex != index)
            this.updateHome();
        },
        async removeActual(index){
            const pokemon = this.actualHome[index];
            await deletePokemon(pokemon.pokemonId)
                .then(response => {
                    this.actualHome = this.actualHome.filter((pokemon, entryIndex) => entryIndex != index)
                    setPTAActivityToken(response.headers['pta-activity-token']);
                })
                .catch(generateErrorModal);
        },
        updateHome(){
            setPokemonNewHome(this.pokemonHome)
        }
    }
}
</script>
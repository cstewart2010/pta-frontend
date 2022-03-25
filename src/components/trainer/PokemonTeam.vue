<template>
    <div class="text-center">
        <h3>Pokemon Team</h3>
        <hr/>
        <div class="row">
            <div class="col-1">Number</div>
            <div class="col-3">Icon</div>
            <div class="col-2 text-center">Nickname</div>
            <div class="col-1 text-center">Species</div>
            <div class="col-3">Notes</div>
            <div class="col-1">Delete</div>
        </div>
        <div id="pokemonTeam" class="my-1">
            <div v-for="(pokemon, index) in actualTeam" :key="pokemon">
                <div class="row d-flex align-items-center" :id="'pokemon-'+index">
                    <actual-pokemon :pokemonId="pokemon.pokemonId" :trainerId="trainer.trainerId" :position="index + 1" />
                    <div class="col-1">
                        <button class="btn-close" @click="removeActual(index)" />
                    </div>
                </div>
                <hr/>
            </div>
        </div>
        <div id="addedPokemon" class="my-1">
            <div v-for="(pokemon, index) in pokemonTeam" :key="pokemon">
                <div class="row d-flex align-items-center" :id="'pokemon-'+index">
                    <added-pokemon :pokemon="pokemon" :isOnActiveTeam="true" :position="index + 1" />
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
import { deletePokemon, getGamePokemon } from '../../api/pokemon.api'
import { getPokemonNewTeam, setPokemonNewTeam, getPokemonNewHome, setPokemonNewHome, getTrainer, setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from './parts/AddedPokemon.vue';
import ActualPokemon from './parts/ActualPokemon.vue';

export default {
    name: 'PokemonTeam',
    data(){
        return {
            trainer: getTrainer(),
            pokemonCol: [],
            actualTeam: [],
            pokemonTeam: [],
            actualHome: [],
            pokemonHome: [],
            addedPokemon: ''
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
                this.trainer.pokemonTeam
                    .map(async pokemon => await getGamePokemon(pokemon.pokemonId).then(response => {
                        this.actualTeam.push(response.data)
                    }) )
                this.trainer.pokemonHome
                    .map(async pokemon => await getGamePokemon(pokemon.pokemonId).then(response => {
                        this.actualHome.push(response.data)
                    }) )
                const pokemonTeam = getPokemonNewTeam();
                if (pokemonTeam){
                    this.pokemonTeam = pokemonTeam;
                }
                const pokemonHome = getPokemonNewHome();
                if (pokemonHome){
                    this.pokemonHome = pokemonHome;
                }
            })
            .catch(generateErrorModal);
    },
    methods:{
        addPokemon(){
            if ((this.pokemonTeam.length + this.actualTeam.length) > 5){
                this.pokemonHome.push({
                    speciesName: this.pokemonCol[this.addedPokemon - 1],
                    nickname: this.pokemonCol[this.addedPokemon - 1],
                    isOnActiveTeam: false
                });
                this.updateHome();
            }
            else {
                this.pokemonTeam.push({
                    speciesName: this.pokemonCol[this.addedPokemon - 1],
                    nickname: this.pokemonCol[this.addedPokemon - 1],
                    isOnActiveTeam: true
                });
                this.updateTeam();
            }
        },
        remove(index){
            this.pokemonTeam = this.pokemonTeam.filter((pokemon, entryIndex) => entryIndex != index)
            this.updateTeam();
        },
        async removeActual(index){
            const pokemon = this.actualTeam[index];
            await deletePokemon(pokemon.pokemonId)
                .then(response => {
                    this.actualTeam = this.actualTeam.filter((pokemon, entryIndex) => entryIndex != index)
                    setPTAActivityToken(response.headers['pta-activity-token']);
                })
                .catch(generateErrorModal);
        },
        updateTeam(){
            setPokemonNewTeam(this.pokemonTeam)
        },
        updateHome(){
            setPokemonNewHome(this.pokemonHome)
        }
    }
}
</script>
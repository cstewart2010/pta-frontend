<template>
    <div class="text-center">
        <h3>Pokemon Team</h3>
        <hr/>
        <div class="row">
            <div class="col-md-1">Number</div>
            <div class="col-md-1">Icon</div>
            <div class="col-md-2">Nickname</div>
            <div class="col-md-1">Species</div>
            <div class="col-md-2">Current HP</div>
            <div class="col-md-4">Notes</div>
            <div class="col-md-1">Delete</div>
        </div>
        <div id="addedPokemon" class="my-1">
            <div v-for="(pokemon, index) in pokemonTeam" :key="pokemon">
                <div class="row d-flex align-items-center" :id="'pokemon-'+index">
                    <added-pokemon :pokemon="pokemon" :position="index + 1" />
                    <div class="col-md-1">
                        <button class="btn-close" @click="remove(index)" />
                    </div>
                </div>
                <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
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
import { getPokemonTeam, setPokemonTeam, getPokemonHome, setPokemonHome } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from './incomplete/AddedPokemon.vue';

export default {
    name: 'PokemonTeam',
    data(){
        return {
            pokemonCol: [],
            pokemonTeam: [],
            pokemonHome: [],
            addedPokemon: '',
        }
    },
    components:{
        AddedPokemon
    },
    beforeMount:async function(){        
        await getAllPokemon()
            .then(response => {
                this.pokemonCol = response.data.results.map(item => item.name)
                const pokemonTeam = getPokemonTeam();
                if (pokemonTeam){
                    this.pokemonTeam = pokemonTeam;
                }
                const pokemonHome = getPokemonHome();
                if (pokemonHome){
                    this.pokemonHome = pokemonHome;
                }
            })
            .catch(generateErrorModal);
    },
    methods:{
        addPokemon(){
            if (this.pokemonTeam.length == 6){
                this.pokemonHome.push(this.addedPokemon);
                this.updateHome();
            }
            else {
                this.pokemonTeam.push(this.addedPokemon);
                this.updateTeam();
            }
        },
        remove(index){
            this.pokemonTeam = this.pokemonTeam.filter((pokemon, entryIndex) => entryIndex != index)
            this.updateTeam();
        },
        updateTeam(){
            setPokemonTeam(this.pokemonTeam)
        },
        updateHome(){
            setPokemonHome(this.pokemonHome)
        }
    }
}
</script>
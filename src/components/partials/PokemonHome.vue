<template>
    <div class="text-center">
        <h3>Pokemon Home</h3>
        <hr/>
        <div id="addedPokemon" class="my-1 ">
            <div class="d-flex flex-wrap flex-row justify-content-evenly">
                <div v-for="(pokemon, index) in pokemonHome" :key="pokemon">
                    <div class="row align-items-center" :id="'pokemon-'+index">
                        <added-pokemon :pokemon="pokemon" :isOnActiveTeam="false" :position="index + 1" />
                        <div class="col-md-1">
                            <button class="btn-close" @click="remove(index)" />
                        </div>
                    </div>
                    <hr/>
                </div>
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
import { getPokemonNewHome, setPokemonNewHome } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from './incomplete/AddedPokemon.vue';

export default {
    name: 'PokemonHome',
    data(){
        return {
            pokemonCol: [],
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
                const pokemonHome = getPokemonNewHome();
                if (pokemonHome){
                    this.pokemonHome = pokemonHome;
                }
            })
            .catch(generateErrorModal);
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
        updateHome(){
            setPokemonNewHome(this.pokemonHome)
        }
    }
}
</script>
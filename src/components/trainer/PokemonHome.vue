<template>
    <div class="text-center" v-if="isReady">
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
        <div id="addedPokemon" class="my-1" v-if="!trainer.isComplete || isGM">
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
        <div class="row" v-if="!trainer.isComplete || isGM">
            <div class="col-3" v-if="pokemonCol">
                <input class="form-control my-1" list="datalistOptions" id="pokemonDataList" v-model="addedPokemon" placeholder="Type to search...">
                <datalist id="datalistOptions" name="pokemon">
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon.name+'_'+pokemon.form" :value="pokemon.friendly">
                        {{index}}
                    </option>
                </datalist>
                <button class="btn btn-primary my-1" @click="addPokemon">Add this pokemon</button>
            </div>
        </div>
    </div>
    <spinner v-else />
</template>

<script>
import { getAllBasePokemon } from '../../api/dex.api'
import { deletePokemon } from '../../api/pokemon.api';
import { getActualHome, getDBPokedex, getIsGM, getPokemonNewHome, getTrainer, setActualHome, setDBPokedex, setPokemonNewHome, setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from './parts/AddedPokemon.vue';
import ActualPokemon from './parts/ActualPokemon.vue';
import Spinner from '../partials/Spinner.vue'

export default {
    name: 'PokemonHome',
    data(){
        return {
            trainer: getTrainer(),
            pokemonCol: getDBPokedex(),
            pokemonHome: getPokemonNewHome() || [],
            actualHome: getActualHome(),
            addedPokemon: '',
            isGM: getIsGM(),
            isReady: false
        }
    },
    components:{
        AddedPokemon,
        ActualPokemon,
        Spinner
    },
    async beforeMount(){
        if (!this.actualHome){
            this.actualHome = this.trainer.pokemonHome;
            setActualHome(this.actualHome)
        }
        
        if (!(this.pokemonCol || this.trainer.isComplete)){
            await getAllBasePokemon()
                .then(response => {
                    for (const item of response.data){
                        let friendly = item.name;
                        if (item.form != "Base"){
                            friendly = `${item.form.replace("Base/", "")} ${item.name}`
                        }
                        this.pokemonCol[friendly] = item;
                    }
                })
                .catch(generateErrorModal);
            
            setDBPokedex(this.pokemonCol)
        }
        
        this.isReady = true
    },
    methods:{
        addPokemon(){
            const pokemon = this.pokemonCol[this.addedPokemon];
            this.pokemonHome.push({
                speciesName: pokemon.name,
                nickname: pokemon.name,
                isOnActiveTeam: false,
                form: pokemon.form
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
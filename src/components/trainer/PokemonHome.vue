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
</template>

<script>
import { getAllBasePokemon } from '../../api/dex.api'
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
            pokemonCol: {},
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
        await getAllBasePokemon()
            .then(response => {
                for (const item of response.data){
                    let friendly = item.name;
                    if (item.form != "Base"){
                        friendly = `${item.form.replace("Base/", "")} ${item.name}`
                    }
                    this.pokemonCol[friendly] = item;
                }
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
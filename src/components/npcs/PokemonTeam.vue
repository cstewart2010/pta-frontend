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
import { deletePokemon } from '../../api/pokemon.api'
import { setPokemonNewTeam, setPTAActivityToken, getNpc, getDBPokedex, getActualTeam, getActualHome, setActualTeam, setActualHome, setDBPokedex } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedPokemon from '../trainer/parts/AddedPokemon.vue';
import ActualPokemon from '../trainer/parts/ActualPokemon.vue';

export default {
    name: 'NpcPokemonTeam',
    data(){
        return {
            pokemonCol: getDBPokedex(),
            actualTeam: getActualTeam(),
            pokemonTeam: getActualHome(),
            trainer: getNpc(this.npcId),
            addedPokemon: ''
        }
    },
    components:{
        AddedPokemon,
        ActualPokemon
    },
    props: {
        npcId: {
            default: null
        }
    },
    async beforeMount(){       
        if (!this.actualTeam){
            this.actualTeam = this.trainer.pokemonTeam;            
            setActualTeam(this.actualTeam)
        }
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
            if ((this.pokemonTeam.length + this.actualTeam.length) < 6) {
                this.pokemonTeam.push({
                    speciesName: pokemon.name,
                    nickname: pokemon.name,
                    isOnActiveTeam: true,
                    form: pokemon.form
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
        }
    }
}
</script>
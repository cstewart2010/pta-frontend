<template>
    <form :id="addWildPokemonFormId" class="row needs-validation" @submit.prevent="addWild">
        <h5>Add Wild Pokemon</h5>
        <div class="col-3">
            <input class="form-control" list="datalistOptions" id="pokemon-data-list" v-model="wildPokemon" placeholder="Type to search..." required>
            <datalist id="datalistOptions" name="pokemon">
                <option v-for="(pokemon, index) in pokemonCollection" :key="index" :id="pokemon.name+'_'+pokemon.form" :value="pokemon.friendly">
                    {{index}}
                </option>
            </datalist>
            <label for="pokemon-data-list" class="form-label">Add Wild Pokemon</label>
            <validation-feedback name="Wild Pokemon" :useInvalid="false" />
        </div>
        <div class="col-3">
            <input id="add-wild-pokemon-x" class="form-control" type="number" min="0" :max="length" v-model="x" required>
            <label for="add-wild-pokemon-x" class="form-label">x-coordinate</label>
            <validation-feedback name="X coordinate" :useInvalid="false" />
        </div>
        <div class="col-3">
            <input id="add-wild-pokemon-y" class="form-control" type="number" min="0" :max="length" v-model="y" required>
            <label for="add-wild-pokemon-y" class="form-label">y-coordinate</label>
            <validation-feedback name="Y coordinate" :useInvalid="false" />
        </div>
        <div class="col-3 form-check form-switch">
            <input id="add-wild-pokemon-shiny" class="form-check-input" type="checkbox" v-model="forceShiny">
            <label for="add-wild-pokemon-shiny" class="form-label">Force Shiny</label>
        </div>
        <div class="col-12">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="submit">Add</button>
        </div>
    </form>
    <hr>
</template>

<script>
import ValidationFeedback from '../../partials/ValidationFeedback.vue'
import { getAllBasePokemon } from '../../../api/dex.api';
import { createWildPokemon } from '../../../api/game.api';
import { deletePokemon } from '../../../api/pokemon.api';
import { addToActiveEncounter } from '../../../api/setting.api';
import { checkValidation, removeValidation } from '../../../utils/credentials';
import { setPTAActivityToken } from '../../../utils/localStorage';
import { generateErrorModal } from '../../../utils/modalUtil';
export default {
    name: 'AddWildPokemon',
    props: {
        socket: {
            default: {}
        }
    },
    components:{
        ValidationFeedback
    },
    data(){
        return {
            addWildPokemonFormId: 'add-wild-pokemon',
            pokemonCollection: {},
            wildPokemon: '',
            length: 15,
            x: 0,
            y: 0,
            forceShiny: false
        }
    },
    async beforeMount(){
        await getAllBasePokemon()
            .then(response => {
                for (const item of response.data){
                    let friendly = item.name;
                    if (item.form != "Base"){
                        friendly = `${item.form.replace("Base/", "")} ${item.name}`
                    }
                    this.pokemonCollection[friendly] = item;
                }
            })
            .catch(generateErrorModal);
    },
    methods: {
        async addWild(){
            if (!checkValidation(this.addWildPokemonFormId)){
                return;
            }
            const pokemon = this.pokemonCollection[this.wildPokemon];
            await createWildPokemon(pokemon.name, '', '', '', pokemon.form, '', this.forceShiny)
                .then(async (response)=> {
                    removeValidation(this.addWildPokemonFormId);
                    const pokemonModel = response.data;
                    await addToActiveEncounter({
                        participantId: pokemonModel.pokemonId,
                        name: pokemonModel.nickname,
                        health: "Feeling fresh!",
                        type: "WildPokemon",
                        position: {
                            x: this.x,
                            y: this.y
                        },
                        speed: pokemonModel.pokemonStats.speed
                    })
                    .then(() =>  this.socket.send(""))
                    .catch(async () => {
                        await deletePokemon(pokemonModel.pokemonId)
                            .then(response => {
                                setPTAActivityToken(response.headers['pta-activity-token']);
                            })
                        generateErrorModal({
                            status: `There is already a unit at (${this.x},${this.y})`,
                            reason: `Deleting ${pokemonModel.nickname}`
                        })
                    })
                })
                .catch(generateErrorModal);
        },
    }
}
</script>
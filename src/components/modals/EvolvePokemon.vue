<template>
    <button class="btn btn-success" data-bs-toggle="modal" :data-bs-target="'#evolve-'+pokemon.pokemonId">Evolve!!</button>
    <div class="modal fade" :id="'evolve-'+pokemon.pokemonId" tabindex="-1" :aria-labelledby="'evolve-'+pokemon.pokemonId+'-label'" aria-hidden="true" v-if="pokemon.canEvolve">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="'evolve-'+pokemon.pokemonId+'-label'">Evolution Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="selectedForm == null">
                        To what?
                        {{possibleForms}}
                    </div>
                    <div v-else>
                        <div class="input-group">
                            <span class="input-group-text">Select the moves you wanna keep:</span>
                            <select class="form-select" v-model="keptMoves" multiple>
                                <option  v-for="(move, index) in pokemon.moves" :key="index" :value="move">
                                    {{move}}
                                </option>
                            </select>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text">Select the moves you wanna learn:</span>
                            <select class="form-select" v-model="newMoves" multiple>
                                <option  v-for="(move, index) in selectedForm.moves" :key="index" :value="move">
                                    {{move}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" @click="evolve">Evolve!!</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" :id="'evolve-'+pokemon.pokemonId" tabindex="-1" :aria-labelledby="'evolve-'+pokemon.pokemonId+'-label'" aria-hidden="true" v-else>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="'evolve-'+pokemon.pokemonId+'-label'">Not Yet Ready</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{pokemon.nickname}} is not ready to evolve
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { evolvePokemon, getPossibleEvolutions } from '../../api/pokemon.api'
import { setPTAActivityToken } from '../../utils/localStorage'
import { generateErrorModal } from '../../utils/modalUtil'
export default {
    name: "EvolvePokemon",
    props: {
        pokemon: {
            default: {}
        }
    },
    data() {
        return {
            possibleForms: [],
            selectedForm: null,
            keptMoves: [],
            newMoves: []
        }
    },
    async beforeMount(){
        await getPossibleEvolutions(this.pokemon.pokemonId)
            .then(response => {
                this.possibleForms = response.data
                if (this.possibleForms.length == 1){
                    this.selectedForm = this.possibleForms[0]
                }
            })
    },
    methods: {
        async evolve(){
            if (this.selectedForm != null){
                var moveLength = this.keptMoves.length + this.newMoves.length
                if (moveLength < 7 && moveLength > 0){
                    await evolvePokemon(this.pokemon.pokemonId, this.selectedForm.name, this.keptMoves, this.newMoves)
                        .then(response => {
                            setPTAActivityToken(response.headers["pta-activity-token"])
                            location.reload();
                        })
                        .catch(generateErrorModal)
                }
                else{
                    console.log(`Invalid move list (${moveLength}) ${this.keptMoves.concat(this.newMoves)}`)
                }
            }
            else {
                console.log('No evolution selected');
            }
        },
    }
}
</script>
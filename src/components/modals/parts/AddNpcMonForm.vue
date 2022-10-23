<template>
    <form :id="addNpcMonFormId" class="row needs-validation" @submit.prevent="addNpcMon">
        <h5>Add Npc's Pokemon</h5>
        <div class="col-3">
            <select id="add-npc-id" v-model="npcSelection" class="form-select" @change="getNpc" required>
                <option value="" selected disabled></option>
                <option v-for="(npc, index) in npcs" :key="index" :value="index">
                    {{npc.trainerName}}
                </option>
            </select>
            <label for="add-npc-id" class="form-label">Select the Npc</label>
            <validation-feedback name="Add Npc" :useInvalid="false" />
        </div>
        <div class="col-3">
            <select id="add-npc-mon-id" v-model="npcMonSelection" class="form-select" required>
                <option value="" selected disabled></option>
                <option v-for="(pokemon, index) in selectedNpc.pokemonTeam" :key="index" :value="pokemon">
                    {{pokemon.nickname}}
                </option>
            </select>
            <label for="add-npc-mon-id" class="form-label">Add Npc Mon</label>
        </div>
        <div class="col-3">
            <input id="add-npc-mon-x" class="form-control" type="number" min="0" :max="length" v-model="x" required>
            <label for="add-npc-mon-x" class="form-label">x-coordinate</label>
            <validation-feedback name="X coordinate" :useInvalid="false" />
        </div>
        <div class="col-3">
            <input id="add-npc-mon-y" class="form-control" type="number" min="0" :max="length" v-model="y" required>
            <label for="add-npc-mon-y" class="form-label">y-coordinate</label>
            <validation-feedback name="Y coordinate" :useInvalid="false" />
        </div>
        <div class="col-12">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="submit">Add</button>
        </div>
    </form>
    <hr>
</template>

<script>
import ValidationFeedback from '../../partials/ValidationFeedback.vue'
import { addToActiveEncounter } from '../../../api/setting.api';
import { checkValidation, removeValidation } from '../../../utils/credentials';
import { generateErrorModal } from '../../../utils/modalUtil';
export default {
    name: 'AddNpcMon',
    props: {
        socket: {
            default: {}
        },
        npcs: {
            default: []
        },
        encounterMap: {
            default: [[]]
        }
    },
    components: {
        ValidationFeedback
    },
    data(){
        return {
            addNpcMonFormId: 'add-npc-mon',
            npcSelection: -1,
            selectedNpc: {
                pokemonTeam: []
            },
            npcMonSelection: null,
            wildPokemon: '',
            length: 15,
            x: 0,
            y: 0,
        }
    },
    methods: {
        getNpc(){
            this.selectedNpc = this.npcs[this.npcSelection];
        },        
        async addNpcMon(){
            if (!checkValidation(this.addNpcMonFormId)){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }
            if (!this.npcMonSelection){
                return;
            }
                        
            await addToActiveEncounter({
                participantId: this.npcMonSelection.pokemonId,
                name: this.npcMonSelection.nickname,
                health: "Feeling fresh!",
                type: "EnemyPokemon",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: this.npcMonSelection.pokemonStats.speed
            })
            .then(() => {
                removeValidation(this.addNpcMonFormId);
                this.socket.send("")
            })
            .catch(generateErrorModal)
        },
    }
}
</script>
<template>
    <form :id="addNpcFormId" class="row needs-validation" @submit.prevent="addNpc">
        <h5>Add Npc</h5>
        <div class="col-4">
            <select id="add-npc-id" v-model="npcSelection" class="form-select" required>
                <option value="" selected disabled></option>
                <option v-for="(npc, index) in npcs" :key="index" :value="index">
                    {{npc.trainerName}}
                </option>
            </select>
            <label for="add-npc-id" class="form-label">Add Npc</label>
            <validation-feedback name="Add Npc" :useInvalid="false" />
        </div>
        <div class="col-4">
            <input id="add-npc-x" class="form-control" type="number" min="0" :max="length" v-model="x" required>
            <label for="add-npc-x" class="form-label">x-coordinate</label>
            <validation-feedback name="X coordinate" :useInvalid="false" />
        </div>
        <div class="col-4">
            <input id="add-npc-y" class="form-control" type="number" min="0" :max="length" v-model="y" required>
            <label for="add-npc-y" class="form-label">y-coordinate</label>
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
    name: 'AddNpc',
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
            addNpcFormId: 'add-npc',
            npcSelection: -1,
            wildPokemon: '',
            length: 15,
            x: 0,
            y: 0,
        }
    },
    methods: {
        async addNpc(){
            if (!checkValidation(this.addNpcFormId)){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }
            var npc = this.npcs[this.npcSelection];
            if (!npc){
                return;
            }
            
            await addToActiveEncounter({
                participantId: npc.npcId,
                name: npc.trainerName,
                health: "Feeling fresh!",
                type: "EnemyNpc",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: npc.trainerStats.speed
            })
            .then(() => {
                removeValidation(this.addNpcFormId);
                this.socket.send("")
            })
            .catch(generateErrorModal)
        },
    }
}
</script>
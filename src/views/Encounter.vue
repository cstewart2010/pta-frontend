<template>
    <div v-if="encounter.encounterId != null">
        <h1>{{encounter.name}} Map</h1>
        <div class="input-group my-1 col-2" v-if="!isGM">
            <span class="input-group-text">Send out pokemon</span>
            <select class="form-select" v-model="pokemonToAdd">
                <option v-for="(pokemon, index) in trainerMons" :key="index" :value="index">
                    {{pokemon.nickname}}
                </option>
            </select>
            <span class="input-group-text">x-coordinate</span>
            <input type="number" min="0" :max="length" v-model="x">
            <span class="input-group-text">y-coordinate</span>
            <input type="number" min="0" :max="length" v-model="y">
            <button class="btn btn-secondary" @click="sendOut">Send out</button>
        </div>
        <div v-else>
            <div class="input-group my-2">
                <span class="input-group-text">Remove from encounter</span>
                <select v-model="removalOption" class="form-select">
                    <option value=""></option>
                    <option
                        v-for="activeParticipant in activeParticipants"
                        :key="activeParticipant.participantId"
                        :value="activeParticipant.participantId">
                        ({{activeParticipant.type}}) {{activeParticipant.name}}
                    </option>
                </select>
                <button class="btn btn-danger" @click="removeFromEncounter">Remove</button>
            </div>
            <section v-if="displaySection">
                <trainer-sheet :trainerId="participantId" v-if="displaySection == 'Trainer'" />
                <pokemon-sheet :pokemonId="participantId" v-if="displaySection == 'Pokemon'" />
            </section>
        </div>
        <div class="input-group my-1 col-2" v-if="needToJoin">
            <span class="input-group-text">Join the Encounter</span>
            <span class="input-group-text">x-coordinate</span>
            <input type="number" min="0" :max="length" v-model="x">
            <span class="input-group-text">y-coordinate</span>
            <input type="number" min="0" :max="length" v-model="y">
            <button class="btn btn-secondary" @click="join">Join</button>
        </div>
        <div v-if="isGM">
            <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
                <button :class="'col border border-dark btn grid-cell ' + cellData.color" v-for="(cellData, columnIndex) in row" :key="`${rowIndex}_${columnIndex}`">
                    <img class="img-fluid"
                        :src="cellData.url"
                        :alt="cellData.alt"
                        @click="changeDisplay(cellData)"
                        v-if="cellData.url && cellData.url.length > 0">
                    <div
                        class=" grid-cell"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-else>
                    </div>
                    <cell-modal
                        :participant="cellData.participant"
                        :x="rowIndex"
                        :y="columnIndex"
                        :modalSize="cellData.modalSize"
                        :trainerMons="trainerMons"
                        :participants="activeParticipants" />
                </button>
            </div>
        </div>
        <div v-else>
            <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
                <button :class="'col border border-dark btn grid-cell ' + cellData.color" v-for="(cellData, columnIndex) in row" :key="`${rowIndex}_${columnIndex}`">
                    <img class="img-fluid"
                        :src="cellData.url"
                        :alt="cellData.alt"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-if="cellData.url && cellData.url.length > 0">
                    <div
                        class=" grid-cell"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-else>
                    </div>
                    <cell-modal
                        :participant="cellData.participant"
                        :x="rowIndex"
                        :y="columnIndex"
                        :modalSize="cellData.modalSize"
                        :trainerMons="trainerMons"
                        :participants="activeParticipants" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { getGameId, getIsGM, getTrainer, getTrainerId, setCellParticipant, } from '../utils/localStorage'
import { addToActiveEncounter, getActiveEncounter, removeFromActiveEncounter } from '../api/encounter.api'
import { generateErrorModal } from '../utils/modalUtil'
import CellModal from '../components/modals/CellModal.vue'
import { getGamePokemon } from '../api/pokemon.api'
import { findTrainerInGame } from '../api/game.api'
import TrainerSheet from '../components/encounter/TrainerSheet.vue'
import PokemonSheet from '../components/encounter/PokemonSheet.vue'
export default {
    name: "Encounter",
    components: {
        CellModal,
        TrainerSheet,
        PokemonSheet
    },
    data() {
        return {
            isGM: getIsGM(),
            length: 15,
            encounterMap: [
                [
                    {
                        color: null,
                        url: '',
                        participant: {},
                        modalSize: '',
                        alt: ''
                    }
                ]
            ],
            pokemonToAdd: "",
            trainerMons: [],
            gameId: getGameId(),
            encounter: {},
            needToJoin: true,
            x: 0,
            y: 0,
            displaySection: null,
            participantId: '',
            activeParticipants: [],
            removalOption: ''
        }
    },
    async beforeMount(){
        if (this.gameId){
            this.encounter = await this.getEncounter();
            this.activeParticipants = this.encounter.activeParticipants;
            if (!this.encounter.name){
                return;
            }
            for (let i = 0; i <= this.length; i++){
                this.encounterMap[i] = [];
                for (let j = 0; j <= this.length; j++){
                    this.encounterMap[i][j] = {
                        color: null,
                        participant: {}
                    }
                }
            }
            if (!this.isGM){
                this.trainerMons = getTrainer().pokemonTeam
            }
            this.needToJoin = !(this.isGM || this.encounter.activeParticipants.some(participant => participant.participantId == getTrainerId()))
            for (const participant of this.encounter.activeParticipants) {
                const source = await this.setACellParticipant(participant);
                this.encounterMap[participant.position.x][participant.position.y].participant = participant;
                this.encounterMap[participant.position.x][participant.position.y].alt = participant.name;
                this.encounterMap[participant.position.x][participant.position.y].modalSize = 'modal-fullscreen'
                if (participant.type == "Pokemon"){
                    if (source.isShiny){
                        this.encounterMap[participant.position.x][participant.position.y].url = `https://play.pokemonshowdown.com/sprites/ani-shiny/${source.shinyPortrait}.gif`
                    }
                    else{
                        this.encounterMap[participant.position.x][participant.position.y].url = `https://play.pokemonshowdown.com/sprites/ani/${source.shinyPortrait}.gif`
                    }
                    this.encounterMap[participant.position.x][participant.position.y].color = "bg-success"
                }
                else{
                    this.encounterMap[participant.position.x][participant.position.y].url = `http://play.pokemonshowdown.com/sprites/trainers/${source.sprite}.png`
                    this.encounterMap[participant.position.x][participant.position.y].color = "bg-dark"
                }
            }
        }
    },
    methods: {
        async getEncounter(){
            return await getActiveEncounter(this.gameId)
                .then(response => response.data)
                .catch(generateErrorModal)
        },
        async join(){
            if (this.x > this.length || this.x < 0){
                return;
            }
            if (this.y > this.length || this.y < 0){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }

            var trainer = getTrainer()
            await addToActiveEncounter({
                participantId: trainer.trainerId,
                name: trainer.trainerName,
                health: "Feeling fresh!",
                type: "Trainer",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: trainer.trainerStats.speed
            })
            .then(() => location.reload())
            .catch(generateErrorModal)
        },
        async sendOut(){
            if (this.x > this.length || this.x < 0){
                return;
            }
            if (this.y > this.length || this.y < 0){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }
            if (!this.trainerMons[this.pokemonToAdd]){
                return;
            }

            var pokemon = this.trainerMons[this.pokemonToAdd];
            await addToActiveEncounter({
                participantId: pokemon.pokemonId,
                name: pokemon.nickname,
                health: "Feeling fresh!",
                type: "Pokemon",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: pokemon.pokemonStats.speed
            })
            .then(() => location.reload())
            .catch(generateErrorModal)
        },
        async setACellParticipant(participant){
            if (participant.type == "Trainer"){
                return await findTrainerInGame(getGameId(), participant.participantId)
                    .then(response => {
                        setCellParticipant(participant.participantId, response.data.trainer)
                        return response.data.trainer;
                    })
                    .catch(console.log);
            }
            else if (participant.type == "Pokemon"){
                return await getGamePokemon(participant.participantId)
                    .then(response => {
                        setCellParticipant(participant.participantId, response.data)
                        return response.data;
                    })
                    .catch(console.log);
            }
        },
        async removeFromEncounter(){
            if (this.removalOption){
                await removeFromActiveEncounter(this.removalOption)
                    .then(() => location.reload())
                    .catch(generateErrorModal)
            }
        },
        changeDisplay(cellData){
            if (cellData.participant.participantId == this.participantId){
                if (this.displaySection){
                    this.displaySection = null
                }
                else {
                    this.displaySection = cellData.participant.type
                }
            }
            else {
                this.displaySection = cellData.participant.type
                this.participantId = cellData.participant.participantId
            }
        }
    }
}
</script>

<style scoped>
.grid-cell {
    width: 75px;
    height: 75px;
}
</style>
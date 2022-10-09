<template>
    <div class="modal fade" :id="`cellModal_${x}_${y}`" tabindex="-1" :aria-labelledby="`cellModalLabel_${x}_${y}`" aria-hidden="true">
        <div :class="`modal-dialog ${modalSize}`">
            <div class="modal-content">
                <div class="modal-header d-block">
                    <h5 class="modal-title" :id="`cellModalLabel_${x}_${y}`">
                        <span v-if="participant.Name">{{participant.Name}}</span>
                        <span v-else>Empty Cell Block</span>
                    </h5>
                </div>
                <div class="modal-body">
                    <div v-if="participant.Type == null">
                        <div class="container">
                            Would you like to move to cell ({{x}},{{y}})?
                            <div class="row" v-if="isGM">
                                <button
                                    type="button"
                                    class="btn btn-success my-3"
                                    data-bs-dismiss="modal"
                                    v-for="(activeParticipant, index) in participants"
                                    :key="index"
                                    @click="move(activeParticipant.ParticipantId)">
                                    {{activeParticipant.Name}}
                                </button>
                            </div>
                            <div class="row" v-else>
                                <button
                                    type="button"
                                    class="btn btn-success my-3"
                                    data-bs-dismiss="modal"
                                    @click="moveTrainer">
                                    {{self}}
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success my-3"
                                    data-bs-dismiss="modal"
                                    v-for="(pokemon, index) in trainerMons"
                                    :key="index"
                                    @click="movePokemon(pokemon)">
                                    {{pokemon.nickname}}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="participant.Type == 'Trainer'">
                        <trainer-sheet :trainerId="participant.ParticipantId" />
                    </div>
                    <div v-else-if="participant.Type.includes('Pokemon')">
                        <pokemon-sheet :pokemonId="participant.ParticipantId" :socket="socket" />
                    </div>
                    <div v-else-if="participant.Type.includes('Npc')">
                        <npc-sheet :npcId="participant.ParticipantId" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getGameId, getIsGM, getTrainer, setCellParticipant } from '../../utils/localStorage'
import { findTrainerInGame } from '../../api/game.api'
import TrainerSheet from '../encounter/TrainerSheet.vue'
import PokemonSheet from '../encounter/PokemonSheet.vue'
import NpcSheet from '../encounter/NpcSheet.vue'
import { addToActiveEncounter, updateParticipantPosition, updatePokemonPosition, updateTrainerPosition } from '../../api/encounter.api'
import { generateErrorModal } from '../../utils/modalUtil'
import { getGamePokemon } from '../../api/pokemon.api'
export default {
  components: { TrainerSheet, PokemonSheet, NpcSheet },
    name: 'CellModal',
    props: {
        participant: {
            default: {}
        },
        x: {
            default: 0
        },
        y: {
            default: 0
        },
        modalSize: {
            default: null
        },
        trainerMons: {
            default: []
        },
        participants: {
            default: []
        },
        socket: {
            default: {}
        }
    },
    data(){
        return {
            isGM: getIsGM(),
            self: {},
            gameId: getGameId()
        }
    },
    async beforeMount(){
        if (!this.isGM){
            this.self = getTrainer().trainerName;
        }
        if (this.participant.Type){
            if (this.participant.Type == "Trainer"){
                await findTrainerInGame(this.gameId, this.participant.ParticipantId)
                    .then(response => {
                        setCellParticipant(this.participant.ParticipantId, response.data.trainer)
                    })
                    .catch(console.log);
            }
            else if (this.participant.Type.includes("Pokemon")){
                await getGamePokemon(this.participant.ParticipantId)
                    .then(response => {
                        setCellParticipant(this.participant.ParticipantId, response.data)
                    })
                    .catch(console.log);
            }
        }
    },
    methods: {
        async moveTrainer(){
            var trainer = getTrainer();
            if (this.participants.some(participant => participant.ParticipantId == trainer.trainerId)){
                await updateTrainerPosition(this.x, this.y)
                    .then(() => this.socket.send(""))
                    .catch(generateErrorModal);
            }
            else {
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
                .catch(generateErrorModal)
            }
        },
        async movePokemon(pokemon){
            if (this.participants.some(participant => participant.ParticipantId == pokemon.pokemonId)){
                updatePokemonPosition(pokemon.pokemonId, this.x, this.y)
                    .then(() => this.socket.send(""))
                    .catch(generateErrorModal);
            }
            else {
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
                .catch(generateErrorModal)
            }
        },
        async move(participantId){
            await updateParticipantPosition(participantId, this.x, this.y)
                .then(() => this.socket.send(""))
                .catch(generateErrorModal);
        }
    }
}
</script>
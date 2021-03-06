<template>
    <div class="modal fade" :id="`cellModal_${x}_${y}`" tabindex="-1" :aria-labelledby="`cellModalLabel_${x}_${y}`" aria-hidden="true">
        <div :class="`modal-dialog ${modalSize}`">
            <div class="modal-content">
                <div class="modal-header d-block">
                    <h5 class="modal-title" :id="`cellModalLabel_${x}_${y}`">
                        <span v-if="participant.name">{{participant.name}}</span>
                        <span v-else>Empty Cell Block</span>
                    </h5>
                </div>
                <div class="modal-body">
                    <div v-if="participant.type == null">
                        <div class="container">
                            Would you like to move to cell ({{x}},{{y}})?
                            <div class="row" v-if="isGM">
                                <button
                                    type="button"
                                    class="btn btn-success my-3"
                                    data-bs-dismiss="modal"
                                    v-for="(activeParticipant, index) in participants"
                                    :key="index"
                                    @click="move(activeParticipant.participantId)">
                                    {{activeParticipant.name}}
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
                    <div v-else-if="participant.type == 'Trainer'">
                        <trainer-sheet :trainerId="participant.participantId" />
                    </div>
                    <div v-else-if="participant.type == 'Pokemon'">
                        <pokemon-sheet :pokemonId="participant.participantId" />
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
import { updateParticipantPosition, updatePokemonPosition, updateTrainerPosition } from '../../api/encounter.api'
import { generateErrorModal } from '../../utils/modalUtil'
import { getGamePokemon } from '../../api/pokemon.api'
export default {
  components: { TrainerSheet, PokemonSheet },
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
        }
    },
    data(){
        return {
            isGM: getIsGM(),
            self: getTrainer().trainerName
        }
    },
    async beforeMount(){
        if (this.participant.type == "Trainer"){
            await findTrainerInGame(getGameId(), this.participant.participantId)
                .then(response => {
                    setCellParticipant(this.participant.participantId, response.data.trainer)
                })
                .catch(console.log);
        }
        else if (this.participant.type == "Pokemon"){
            await getGamePokemon(this.participant.participantId)
                .then(response => {
                    setCellParticipant(this.participant.participantId, response.data)
                })
                .catch(console.log);
        }
    },
    methods: {
        async moveTrainer(){
            await updateTrainerPosition(this.x, this.y)
                .then(() => location.reload())
                .catch(generateErrorModal);
        },
        async movePokemon(pokemon){
            if (this.participants.some(participant => participant.participantId == pokemon.pokemonId)){
                updatePokemonPosition(pokemon.pokemonId, this.x, this.y)
                    .then(() => location.reload())
                    .catch(generateErrorModal);
            }
        },
        async move(participantId){
            updateParticipantPosition(participantId, this.x, this.y)
                .then(() => location.reload())
                .catch(generateErrorModal);
        }
    }
}
</script>
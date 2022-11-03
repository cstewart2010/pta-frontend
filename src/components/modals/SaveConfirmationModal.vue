<template>
    <div class="modal fade" id="saveConfirmationModal" tabindex="-1" aria-labelledby="saveConfirmationModalLabel" aria-hidden="true" v-if="isGM || isComplete">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="saveConfirmationModalLabel">Save Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to save your changes?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" data-bs-target="#saveConfirmationModal" @click="saveChange" data-bs-dismiss="modal">Save Changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="completeConfirmationModal" tabindex="-1" aria-labelledby="completeConfirmationModalLabel" aria-hidden="true" v-else>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="completeConfirmationModalLabel">Save Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to save your changes?
                    <div class="text-danger">
                        <strong>Warning:</strong>
                        After saving your changes for the first time, you will no longer be change your origin or starting pokemon.
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" data-bs-target="#completeConfirmationModal" @click="saveChange" data-bs-dismiss="modal">Save Changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { completeTrainer } from '../../api/game.api';
import { refreshInGame } from '../../api/user.api';
import { getCurrentHP, getIsGM, getPokemonNewHome, getPokemonNewTeam, getTrainer, removeFromStorage, setPokemonNewHome, setPokemonNewTeam, setPTAActivityToken, setTrainer } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
export default {
    name: 'SaveConfirmation',
    data(){
        return {
            isComplete: false,
            isGM: getIsGM()
        }
    },
    beforeMount(){
        const trainer = getTrainer();
        this.isComplete = trainer.isComplete
    },
    methods: {
        async saveChange(){
            const trainer = getTrainer();
            trainer.newPokemon = trainer.newPokemon.concat(getPokemonNewTeam())
            trainer.newPokemon = trainer.newPokemon.concat(getPokemonNewHome())
            trainer.currentHp = getCurrentHP() || trainer.currentHp;
            trainer.pokemonTeam = [];
            trainer.pokemonHome = [];
            trainer.pokeDex = [];
            await completeTrainer(trainer)
                .then(() => {
                    setPokemonNewTeam([])
                    setPokemonNewHome([])
                    this.refreshTrainer();
                })
                .catch(generateErrorModal)
        },
        async refreshTrainer(){
            await refreshInGame()
            .then(response => {
                setPTAActivityToken(response.headers['pta-activity-token'])
                if (!this.isGM){
                    setTrainer(response.data.trainer);
                    this.trainer = response.data.trainer;
                    this.isComplete = response.data.trainer.isComplete
                }
                this.$router.go();
            })
            .catch(error => {
                removeFromStorage();
                generateNavigationModal(error.status, error.reason, '/');
            })
        }
    }
}
</script>
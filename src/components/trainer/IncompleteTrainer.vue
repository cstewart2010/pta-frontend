<template>
    <div v-if="sheet=='main'">
        <trainer-sheet />
    </div>
    <div v-else-if="sheet=='features'">
        <class-features />
    </div>
    <div v-else-if="sheet=='moves'">
        <trainer-moves />
    </div>
    <div v-else-if="sheet=='team'">
        <pokemon-team />
    </div>
    <div v-else-if="sheet=='items'">
        <inventory />
    </div>
    <div v-else-if="sheet=='home'">
        <pokemon-home />
    </div>
    <div v-else-if="sheet=='pokedex'">
        <honors />
    </div>
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
    <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('main')">Trainer Sheet</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('features')">Class Features</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('moves')">Trainer Moves</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('items')">Inventory</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('pokedex')">Pokedex and Honors</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('team')">Pokemon Team</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('home')">Pokemon Home</button>
                    </li>
                </ul>
                <div class="d-flex">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#saveConfirmationModal" v-if="isGM || isComplete">Save Changes</button>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#completeConfirmationModal" v-else>Save Changes</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import TrainerSheet from './TrainerSheet.vue';
import ClassFeatures from './ClassFeatures.vue';
import TrainerMoves from './TrainerMoves.vue';
import PokemonTeam from './PokemonTeam.vue';
import PokemonHome from './PokemonHome.vue';
import Honors from './Honors.vue';
import Inventory from './Inventory.vue';
import { getCurrentHP, getGameId, getPokemonNewHome, getPokemonNewTeam, getTrainer, removeFromStorage, setPokemonNewHome, setPokemonNewTeam, setPTAActivityToken, setTrainer, setTrainerId } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
import { completeTrainer, findTrainerInGame } from '../../api/game.api';
import { refreshInGame } from '../../api/user.api'

export default {
    name: "IncompleteTrainer",
    components: {
        TrainerSheet,
        ClassFeatures,
        TrainerMoves,
        PokemonTeam,
        PokemonHome,
        Honors,
        Inventory
    },
    data(){
        return {
            sheet: 'main',
            isComplete: false,
            isGM: false
        }
    },
    props: {
        trainerId: {
            default: null
        }
    },
    async beforeMount(){
        if (this.trainerId){
            await findTrainerInGame(getGameId(), this.trainerId)
                .then(response => {
                    setTrainer(response.data.trainer);
                    setTrainerId(this.trainerId)
                    this.isComplete = response.data.trainer.isComplete
                    this.isGM = response.data.trainer.isGM
                })
                .catch(generateErrorModal)
        }
        else {
            const trainer = getTrainer();
                    this.isComplete = trainer.isComplete
                    this.isGM = trainer.isGM
        }
        this.sheet = localStorage.getItem('savedSheet') || 'main';
    },
    methods: {        
        switchSheet(sheet){
            this.sheet = sheet;
            localStorage.setItem('savedSheet', sheet);
            location.href = '/#';
        },
        async saveChange(){
            const trainer = getTrainer();
            trainer.newPokemon = trainer.newPokemon.concat(getPokemonNewTeam())
            trainer.newPokemon = trainer.newPokemon.concat(getPokemonNewHome())
            trainer.currentHp = getCurrentHP() || trainer.currentHp;
            trainer.pokemonTeam = [];
            trainer.pokemonHome = [];
            trainer.pokeDex = [];
            await completeTrainer(trainer)
                .then(async () => {
                    await this.refreshTrainer();
                    setPokemonNewTeam([])
                    setPokemonNewHome([])
                    this.$router.go();
                })
                .catch(generateErrorModal)
        },
        async refreshTrainer(){
            await refreshInGame()
            .then(response => {
                this.isComplete = response.data.trainer.isComplete
                setPTAActivityToken(response.headers['pta-activity-token']);
                setTrainer(response.data.trainer);
                this.trainer = response.data.trainer;
                this.isComplete = response.data.trainer.isComplete
            })
            .catch(error => {
                removeFromStorage();
                generateNavigationModal(error.status, error.reason, '/');
            })
        }
    }
}
</script>
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
    <save-confirmation />
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
import SaveConfirmation from '../modals/SaveConfirmationModal.vue'
import { getGameId, getIsGM, getTrainer, setTrainer, setTrainerId } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
import { findTrainerInGame } from '../../api/game.api';

export default {
    name: "IncompleteTrainer",
    components: {
        TrainerSheet,
        ClassFeatures,
        TrainerMoves,
        PokemonTeam,
        PokemonHome,
        Honors,
        Inventory,
        SaveConfirmation
    },
    data(){
        return {
            sheet: 'main',
            isComplete: false,
            isGM: getIsGM()
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
                })
                .catch(generateErrorModal)
        }
        else {
            const trainer = getTrainer();
            this.isComplete = trainer.isComplete
        }
        this.sheet = localStorage.getItem('savedSheet') || 'main';
    },
    methods: {        
        switchSheet(sheet){
            this.sheet = sheet;
            localStorage.setItem('savedSheet', sheet);
            location.href = '/#';
        },
    }
}
</script>
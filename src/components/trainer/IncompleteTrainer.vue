<template>
    <trainer-doc v-if="isReady">
        <trainer-sheet v-if="sheet=='main'" />
        <class-features v-else-if="sheet=='features'" />
        <trainer-moves v-else-if="sheet=='moves'" />
        <pokemon-team v-else-if="sheet=='team'" />
        <inventory v-else-if="sheet=='items'" />
        <pokemon-home v-else-if="sheet=='home'" />
        <honors v-else-if="sheet=='pokedex'" />
    </trainer-doc>
    <save-confirmation />
    <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('main')" title="Opens the Trainer sheet">Trainer Sheet</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('features')" title="Open the Features sheet">Class Features</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('moves')" title="Opens the Moves sheet">Trainer Moves</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('items')" title="Opens the Inventory sheet">Inventory</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('pokedex')" title="Opens the Pokedex sheet">Pokedex and Honors</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('team')" title="Opens the Pokemon Team sheet">Pokemon Team</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('home')" title="Opens the Pokemon Home sheet">Pokemon Home</button>
                    </li>
                    <li class="nav-item" v-if="!isGM">
                        <button class="btn btn-dark" @click="refresh" title="Removes unsaved changes">Refresh</button>
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
import { getGameId, getIsGM, getTrainer, removeFromStorage, setPTAActivityToken, setTrainer, setTrainerId } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
import { findTrainerInGame } from '../../api/game.api';
import { refreshInGame } from '../../api/user.api';

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
            isGM: getIsGM(),
            isReady: false
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
        this.isReady = true
    },
    methods: {        
        switchSheet(sheet){
            this.sheet = sheet;
            localStorage.setItem('savedSheet', sheet);
            location.href = '/#';
        },
        async refresh(){
            this.isReady = false;
            await refreshInGame()
            .then(response => {
                this.isComplete = response.data.trainer.isComplete
                setPTAActivityToken(response.headers['pta-activity-token']);
                setTrainer(response.data.trainer);
                this.isReady = true;
            })
            .catch(error => {
                removeFromStorage();
                generateNavigationModal(error.status, error.reason, '/');
            })
        }
    }
}
</script>
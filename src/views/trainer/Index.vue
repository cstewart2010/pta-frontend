<template>
    <div class="pb-5 mb-5">
        <div v-if="isComplete">
            {{trainer}}
        </div>
        <div v-else>
            <incomplete-trainer :sheet="sheet" />
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
                    <button class="btn btn-success">Save Changes</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { refreshTrainer } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainer, removeFromStorage, setTrainer, setPTAActivityToken } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';
import IncompleteTrainer from '../../components/partials/IncompleteTrainer.vue';

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: null,
            isComplete: false,
            sheet: 'main'
        }
    },
    components: {
        IncompleteTrainer
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        
        await refreshTrainer()
        .then(response => {
            this.isComplete = response.data.trainer.isComplete
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (response.data.trainer.isGM){
                this.$router.push('/gm');
                return;
            }
            setTrainer(response.data.trainer);
            this.trainer = getTrainer();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    },
    methods: {
        switchSheet(sheet){
            this.sheet = sheet;
        }
    }
}
</script>
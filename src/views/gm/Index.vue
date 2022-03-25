<template>
    <section v-if="trainerId!=null">
        <incomplete-trainer :trainerId="trainerId" />
    </section>
    <div class="row">
        <div class="" v-for="trainer in trainers.filter(trainer => !trainer.isGM)" :key="trainer.trainerId">
            <button class="btn btn-secondary col-md-6" @click="updateTrainerId(trainer.trainerId)">
                {{trainer.trainerName}}
            </button>
            <button class="btn btn-danger col-md-6" data-bs-toggle="modal" :data-bs-target="'#trainerConfirmationModal'+trainer.trainerId">
                Delete {{trainer.trainerName}}
            </button>
            <trainer-modal :isComplete="trainer.isComplete" :trainerId="trainer.trainerId" />
            <delete-trainer :trainerId="trainer.trainerId" :trainerName="trainer.trainerName" />
        </div>
    </div>
    <div class="row d-flex align-items-right">
        <div class="col-md-2">
            Session Password
            <input type="password" v-model="gameSessionPassword">
        </div>
    </div>
    <delete-game :gameSessionPassword="gameSessionPassword" />
    <export-game :gameSessionPassword="gameSessionPassword" />
</template>

<script>
import { refreshGM } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM, removeTrainer } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue'
import TrainerModal from '../../components/modals/TrainerModal.vue'
import DeleteGame from '../../components/modals/DeleteGame.vue'
import DeleteTrainer from '../../components/modals/DeleteTrainer.vue'
import ExportGame from '../../components/modals/ExportGame.vue'

export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            gameSessionPassword: '',
            trainerId: null
        }
    },
    components: {
        DeleteGame,
        DeleteTrainer,
        TrainerModal,
        ExportGame,
        IncompleteTrainer
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            window.location.href = '/'
            return
        }
        
        await refreshGM()
        .then(response => {
            var wasNotGM = !getIsGM();
            setIsGM(true);
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (wasNotGM){
                window.location.href = '/gm'
            }
            this.trainers = getTrainers();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    },
    methods: {
        updateTrainerId(trainerId){
            if (this.trainerId == trainerId){
                this.trainerId = null;
                removeTrainer()
            }
            else {
                this.trainerId = trainerId;
            }
        }
    }
}
</script>

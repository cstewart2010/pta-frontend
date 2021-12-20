<template>
    <div class="row">
        <div class="" v-for="trainer in trainers.filter(trainer => !trainer.isGM)" :key="trainer.trainerId">
            <button class="btn btn-secondary col-md-6" data-bs-toggle="modal" data-bs-target="#trainerModal">
                {{trainer.trainerName}}
            </button>
            <button class="btn btn-danger col-md-6" data-bs-toggle="modal" data-bs-target="#trainerConfirmationModal">
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
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#gameConfirmationModal">Delete Game</button>
        </div>
    </div>
    <delete-game :gameSessionPassword="gameSessionPassword" />
</template>

<script>
import { refreshGM } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';
import TrainerModal from '../../components/modals/TrainerModal.vue'
import DeleteGame from '../../components/modals/DeleteGame.vue'
import DeleteTrainer from '../../components/modals/DeleteTrainer.vue'

export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            gameSessionPassword: '',
        }
    },
    components: {
        DeleteGame,
        DeleteTrainer,
        TrainerModal
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        
        await refreshGM()
        .then(response => {
            var wasNotGM = !getIsGM();
            setIsGM(true);
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (wasNotGM){
                this.$router.go();
            }
            this.trainers = getTrainers();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    }
}
</script>

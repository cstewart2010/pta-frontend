<template>
    <div class="row">
        <div class="" v-for="trainer in trainers.filter(trainer => !trainer.isGM)" :key="trainer.trainerId">
            <button class="btn btn-secondary col-md-6" @click="generateTrainerModal(trainer.isComplete, trainer.trainerId)">
                {{trainer.trainerName}}
            </button>
            <button class="btn btn-danger col-md-6" data-bs-toggle="modal" data-bs-target="#trainerConfirmationModal" @click="setForDeletion(trainer.trainerId)">
                Delete Trainer
            </button>
        </div>
    </div>
    <div class="row d-flex align-items-right">
        <div class="col-md-2">
            
            Session Password
            <input type="password" v-model="gameSessionPassword">
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#gameConfirmationModal">Delete Game</button>
        </div>
    </div>
    <!-- Delete game -->
    <div class="modal fade" id="gameConfirmationModal" tabindex="-1" aria-labelledby="gameConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="gameConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this game?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-target="#confirmationModal" @click="deleteThisGame" data-bs-dismiss="modal">Delete game</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!--Delete trainer -->
    <div class="modal fade" id="trainerConfirmationModal" tabindex="-1" aria-labelledby="trainerConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="trainerConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this trainer?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-target="#confirmationModal" @click="deleteThisGame" data-bs-dismiss="modal">Delete game</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteTrainer, refreshGM } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
import TrainerModel from '../../components/modals/TrainerModal.vue'
import { createApp } from '@vue/runtime-dom';
import { deleteGame } from '../../api/game.api';

export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            ptaActivityToken: null,
            ptaSessionAuth: null,
            gameSessionPassword: '',
            forDeletion: '',
        }
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        // validate trainer credentials
        
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
    },
    methods: {
        generateTrainerModal(isComplete, trainerId){
            var ComponentApp = createApp(TrainerModel, {
                isComplete,
                trainerId
            });

            const wrapper = document.createElement("div");
            wrapper.id = 'modal-holder';
            ComponentApp.mount(wrapper);
            document.body.appendChild(wrapper);
        },
        setForDeletion(trainerId){
            this.forDeletion = trainerId;
        },
        async deleteThisTrainer(){
            await deleteTrainer(this.forDeletion)
                .catch(generateErrorModal);
        },
        async deleteThisGame(){
            await deleteGame(this.gameSessionPassword)
                .then(() => {
                    removeFromStorage();
                    this.$router.go("/");
                })
                .catch(generateErrorModal);
        }
    }
}
</script>

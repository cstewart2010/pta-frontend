<template>
    <div class="row">
        <div class="col-9 border-end">
            <section class="m-2" v-if="trainerId!=null">
                <incomplete-trainer :trainerId="trainerId" />
            </section>
            <div class="my-3" id="npcs">
                <h3>Trainers</h3>
                <div class="row">
                    <div class="my-1" v-for="trainer in regularTrainers" :key="trainer.trainerId">
                        <button class="btn btn-secondary col-6" @click="updateTrainerId(trainer.trainerId)">
                            {{trainer.trainerName}}
                        </button>
                        <button class="btn btn-danger col-6" data-bs-toggle="modal" :data-bs-target="'#trainerConfirmationModal'+trainer.trainerId">
                            Delete {{trainer.trainerName}}
                        </button>
                        <delete-trainer :trainerId="trainer.trainerId" :trainerName="trainer.trainerName" />
                    </div>
                </div>
                <div class="row" v-if="regularTrainers.length > 0">
                    <div class="input-group my-1">
                        <span class="input-group-text">Add a group honor</span>
                        <textarea class="form-control" v-model="groupHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onGroupHonor">Add honor</button>
                    </div>
                </div>
                <div class="row" v-if="regularTrainers.length > 0">
                    <div class="input-group my-1">
                        <span class="input-group-text">Add a single honor</span>
                        <select class="form-select" v-model="singleRecipient">
                            <option value=""></option>
                            <option v-for="trainer in regularTrainers" :key="trainer.trainerId" :value="trainer.trainerId">
                                {{trainer.trainerName}}
                            </option>
                        </select>
                        <textarea class="form-control" v-model="singleHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onSingleHonor">Add honor</button>
                    </div>
                </div>
            </div>
            <div id="npcs" class="my-3">
                <h3 class="text-muted">NPCS</h3>
                TODO
            </div>
            <div class="my-3" id="danger-zone">
                <h3 class="text-danger">Danger Zone</h3>
                <div class="row">
                    <div class="input-group my-1 col-2">
                        <span class="input-group-text">Session Password</span>
                        <input type="password" v-model="gameSessionPassword">
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <delete-game :gameSessionPassword="gameSessionPassword" />
                    </div>
                    <div class="col-2">
                        <export-game :gameSessionPassword="gameSessionPassword" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col m-2">
            <journal />
        </div>
    </div>
</template>

<script>
import { addGroupHonor, addHonor, refreshGM } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM, removeTrainer } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue'
import DeleteGame from '../../components/modals/DeleteGame.vue'
import DeleteTrainer from '../../components/modals/DeleteTrainer.vue'
import ExportGame from '../../components/modals/ExportGame.vue'
import Journal from '../Journal.vue'

export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            gameSessionPassword: '',
            trainerId: null,
            groupHonor: '',
            singleHonor: '',
            singleRecipient: '',
            regularTrainers: [],
        }
    },
    components: {
        DeleteGame,
        DeleteTrainer,
        ExportGame,
        IncompleteTrainer,
        Journal
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            window.location.href = '/'
            return
        }
        
        await refreshGM()
        .then(response => {
            var wasNotGM = !getIsGM();
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (wasNotGM){
                setIsGM(true);
                window.location.href = '/gm'
            }
            this.trainers = getTrainers();
            this.regularTrainers = this.trainers.filter(trainer => !trainer.isGM)
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
        },
        async onGroupHonor(){
            if (this.groupHonor.length == 0){
                return;
            }
            await addGroupHonor(this.groupHonor)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
                .catch(generateErrorModal);
        },
        async onSingleHonor(){
            if (this.singleHonor.length == 0){
                return;
            }
            if (this.singleRecipient.length == 0){
                return;
            }
            await addHonor(this.singleHonor, this.singleRecipient)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
                .catch(generateErrorModal);
        }
    }
}
</script>

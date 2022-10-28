<template>
    <div class="my-3" id="trainers">
        <div class="d-flex justify-content-between">
            <h3>Trainers</h3>
            <div class="row" id="buttons">
                <div class="col">
                    <button class="btn btn-outline-dark rounded" data-bs-toggle="modal" data-bs-target="#trainerGrantModal" title="Provide a trainer grant" v-if="regularTrainers.length">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </div>
                <div class="col">
                    <div class="form-check form-switch mt-2">
                        <input type="checkbox" class="form-check-input" v-model="toggle" title="Toggle section visibility">
                    </div>
                </div>
            </div>
        </div>
        <div v-show="toggle && regularTrainers.length">
            <div class="row" v-for="trainer in regularTrainers" :key="trainer.trainerId">
                <button class="btn btn-secondary m-1 col-12 col-md" @click="updateTrainerId(trainer.trainerId)">
                    {{trainer.trainerName}}
                </button>
                <button class="btn btn-danger m-1 col-12 col-md" data-bs-toggle="modal" :data-bs-target="'#trainerConfirmationModal'+trainer.trainerId">
                    Delete {{trainer.trainerName}}
                </button>
                <delete-trainer :trainerId="trainer.trainerId" :trainerName="trainer.trainerName" />
            </div>
            <section class="m-2" v-if="trainerId">
                <incomplete-trainer :trainerId="trainerId" />
            </section>
        </div>
        <div v-if="!regularTrainers.length">
            Here is where your trainers will populate
        </div>
        <trainer-grant :regularTrainers="regularTrainers" v-if="regularTrainers.length" />
    </div>
</template>

<script>
import IncompleteTrainer from '../trainer/IncompleteTrainer.vue'
import DeleteTrainer from '../modals/DeleteTrainer.vue'
import TrainerGrant from '../modals/TrainerGrantModal.vue'
import { getGameId, removeTrainer, setTrainer, setTrainerId } from '../../utils/localStorage'
import { findTrainerInGame } from '../../api/game.api'
export default {
    name: "TrainerSection",
    props: {
        regularTrainers: {
            default: []
        }
    },
    data(){
        return {
            trainerId: '',
            gameId: getGameId(),
            toggle: true
        }
    },
    components: {
        IncompleteTrainer,
        DeleteTrainer,
        TrainerGrant
    },
    methods: {
        async updateTrainerId(trainerId){
            if (this.trainerId == trainerId){
                this.trainerId = null;
                removeTrainer()
            }
            else {
                this.npcId = null;
                await findTrainerInGame(this.gameId, trainerId)
                    .then(response => {
                        setTrainer(response.data.trainer);
                        setTrainerId(trainerId)
                    })
                .catch(console.log);
                this.trainerId = trainerId;
            }
        }
    }
}
</script>
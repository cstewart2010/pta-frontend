<template>
    <div class="my-3" id="trainers">
        <h3>
            Trainers
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#trainerGrantModal" title="Add a new shop"  v-if="regularTrainers.length">
                <i class="fa-solid fa-plus"></i>
            </button>
        </h3>
        <div class="row" v-for="trainer in regularTrainers" :key="trainer.trainerId">
            <button class="btn btn-secondary m-1 col-12 col-md" @click="updateTrainerId(trainer.trainerId)">
                {{trainer.trainerName}}
            </button>
            <button class="btn btn-danger m-1 col-12 col-md" data-bs-toggle="modal" :data-bs-target="'#trainerConfirmationModal'+trainer.trainerId">
                Delete {{trainer.trainerName}}
            </button>
            <delete-trainer :trainerId="trainer.trainerId" :trainerName="trainer.trainerName" />
        </div>
        <trainer-grant :regularTrainers="regularTrainers" v-if="regularTrainers.length" />
        <section class="m-2" v-if="trainerId">
            <incomplete-trainer :trainerId="trainerId" />
        </section>
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
            gameId: getGameId()
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
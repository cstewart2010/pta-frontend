<template>    
    <div class="modal fade" :id="'trainerModal'+trainerId" tabindex="-1" aria-labelledby="notificationModalLabel" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel" v-if="isComplete">Trainer</h5>
                    <h5 class="modal-title" id="notificationModalLabel" v-else>Incomplete Trainer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <incomplete-trainer :trainerId="trainerId" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IncompleteTrainer from "../trainer/IncompleteTrainer.vue"

export default {
    name: "TrainerModal",
    props: {
        trainerId: {
            default: null
        },
        isComplete: {
            default: false
        }
    },
    components: {
        IncompleteTrainer
    }
}
</script>
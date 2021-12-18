<template>    
    <div class="modal fade show" id="trainerModal" tabindex="-1" aria-labelledby="notificationModalLabel" style="display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel" v-if="isComplete">Trainer</h5>
                    <h5 class="modal-title" id="notificationModalLabel" v-else>Incomplete Trainer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="goBack"></button>
                </div>
                <div class="modal-body">
                    <incomplete-trainer :trainerId="trainerId" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IncompleteTrainer from "../partials/IncompleteTrainer.vue"

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
    },
    methods:{
        goBack(){
            location.reload();
        }
    }
}
</script>
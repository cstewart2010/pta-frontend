<template>
    <div class="modal fade" :id="'trainerConfirmationModal'+trainerId" tabindex="-1" aria-labelledby="trainerConfirmationModalLabel" aria-hidden="true">
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
                    <button class="btn btn-danger" @click="deleteThisTrainer" data-bs-dismiss="modal">Delete {{trainerName}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteTrainer } from '../../api/trainer.api';
import { setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteTrainer',
    props: {
        trainerName: {
            default: null
        },
        trainerId: {
            default: null
        }
    },
    methods: {        
        async deleteThisTrainer(){
            await deleteTrainer(this.trainerId)
                .then((response) => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.$router.go();
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
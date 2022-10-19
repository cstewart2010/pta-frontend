<template>
    <div class="modal fade" :id="'encounterConfirmationModal'+encounterId" tabindex="-1" aria-labelledby="encounterConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="encounterConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this encounter?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="deleteThisEncounter" data-bs-dismiss="modal">Delete {{encounterName}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteEncounter } from '../../api/setting.api';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteTrainer',
    props: {
        encounterName: {
            default: null
        },
        encounterId: {
            default: null
        }
    },
    methods: {        
        async deleteThisEncounter(){
            await deleteEncounter(this.encounterId)
                .then(() => location.reload())
                .catch(generateErrorModal);
        }
    }
}
</script>
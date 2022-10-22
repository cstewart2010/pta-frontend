<template>
    <div class="modal fade" :id="'settingConfirmationModal'+encounterId" tabindex="-1" aria-labelledby="settingConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="settingConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this setting?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="deleteThisSetting" data-bs-dismiss="modal">Delete {{settingName}}</button>
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
        settingName: {
            default: null
        },
        settingId: {
            default: null
        }
    },
    methods: {        
        async deleteThisSetting(){
            await deleteEncounter(this.settingId)
                .then(() => location.reload())
                .catch(generateErrorModal);
        }
    }
}
</script>
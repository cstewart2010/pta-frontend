<template>
    <div class="modal fade" :id="'npcConfirmationModal'+npcId" tabindex="-1" aria-labelledby="npcConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="npcConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this trainer?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="deleteThisNpc" data-bs-dismiss="modal">Delete {{trainerName}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteNpc } from '../../api/npc.api';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteNpc',
    props: {
        trainerName: {
            default: null
        },
        npcId: {
            default: null
        }
    },
    methods: {        
        async deleteThisNpc(){
            await deleteNpc(this.npcId)
                .then(() => {
                    this.$router.go();
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
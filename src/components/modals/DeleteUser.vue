<template>
    <div class="modal fade" :id="'userConfirmationModal'+user.userId" tabindex="-1" aria-labelledby="userConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userConfirmationModalLabel">Deletion Confirmation ({{user.username}}) </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this user?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="deleteThisUser" data-bs-dismiss="modal">Delete {{user.username}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { forceDeleteUser } from '../../api/user.api';
import { setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteUser',
    props: {
        user: {
            default: {
                userId: ''
            }
        }
    },
    methods: {        
        async deleteThisUser(){
            await forceDeleteUser(this.user.userId)
                .then((response) => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.$router.go();
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
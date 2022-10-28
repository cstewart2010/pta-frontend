<template>
    <div class="modal fade" id="gameConfirmationModal" tabindex="-1" aria-labelledby="gameConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="gameConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this game?
                    <form :id="formId" class="row needs-validation" @submit.prevent="deleteThisGame" novalidate>
                        <div class="col-12">
                            <input type="password" class="form-control" v-model="gameSessionPassword" placeholder="Session password" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
                            <validation-feedback name="Game session password" />
                        </div>
                        <div class="col-12 mt-2">
                            <button type="submit" class="btn btn-danger">Export game</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteGame } from '../../api/game.api';
import { checkValidation, removeValidation } from '../../utils/credentials';
import { removeGameId } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
import ValidationFeedback from '../partials/ValidationFeedback.vue';
export default {
    name: 'DeleteGame',
    data(){
        return {
            gameSessionPassword: '',
            formId: 'export-form'
        }
    },
    components: {
        ValidationFeedback
    },
    methods: {
        async deleteThisGame(){
            if (!checkValidation(this.formId)){
                return;
            }
            
            removeValidation(this.formId);
            await deleteGame(this.gameSessionPassword)
                .then(() => {
                    removeGameId();
                    window.location.href = '/'
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
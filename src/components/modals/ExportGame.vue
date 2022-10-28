<template>
    <div class="modal fade" id="exportConfirmationModal" tabindex="-1" aria-labelledby="exportConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exportConfirmationModalLabel">Exportation Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to export this game? (This will delete the session from the database)
                    <form :id="formId" class="row needs-validation" @submit.prevent="exportThisGame" novalidate>
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
import { exportGame } from '../../api/game.api';
import { checkValidation, removeValidation } from '../../utils/credentials';
import { removeFromStorage } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
import ValidationFeedback from '../partials/ValidationFeedback.vue';
export default {
    name: 'ExportGame',
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
        async exportThisGame(){
            if (!checkValidation(this.formId)){
                return;
            }
            
            removeValidation(this.formId);
            await exportGame(this.gameSessionPassword)
                .then(response => {
                    removeFromStorage();
                    const blob = new Blob([JSON.stringify(response.data)], { type: 'text/plain' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = 'export.json'
                    link.click()
                    URL.revokeObjectURL(link.href)
                    window.location.href = '/'
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
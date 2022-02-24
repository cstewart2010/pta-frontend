<template>
    <div class="row d-flex align-items-right">
        <div class="col-md-2">
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exportConfirmationModal">Export Game</button>
        </div>
    </div>
    <div class="modal fade" id="exportConfirmationModal" tabindex="-1" aria-labelledby="exportConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exportConfirmationModalLabel">Exportation Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to export this game? (This will delete the session from the database)
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-target="#exportConfirmationModal" @click="exportThisGame" data-bs-dismiss="modal">Export game</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { exportGame } from '../../api/game.api';
import { removeFromStorage } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'ExportGame',
    props: {
        gameSessionPassword: {
            default: ''
        }
    },
    methods: {
        async exportThisGame(){
            await exportGame(this.gameSessionPassword)
                .then(response => {
                    removeFromStorage();
                    const blob = new Blob([JSON.stringify(response.data)], { type: 'text/plain' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = 'export.json'
                    link.click()
                    URL.revokeObjectURL(link.href)
                    window.location.href = '/pta'
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
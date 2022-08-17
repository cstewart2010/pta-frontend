<template>
    <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#gameConfirmationModal">Delete Game</button>
    <div class="modal fade" id="gameConfirmationModal" tabindex="-1" aria-labelledby="gameConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="gameConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this game?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-target="#gameConfirmationModal" data-bs-dismiss="modal" @click="deleteThisGame">Delete game</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteGame } from '../../api/game.api';
import { removeFromStorage } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteGame',
    props: {
        gameSessionPassword: {
            default: ''
        }
    },
    methods: {
        async deleteThisGame(){
            await deleteGame(this.gameSessionPassword)
                .then(() => {
                    removeFromStorage();
                    window.location.href = '/'
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
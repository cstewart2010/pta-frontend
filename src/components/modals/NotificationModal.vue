<template>
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body row">
                    Participants
                    <div v-for="(participant, index) in participants" :key="index">
                        {{participant.isGM ? "GM" : "Trainer"}} - {{participant.trainerName.toUpperCase()}}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="goTo()">Launch Game</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { findTrainerInGame } from '../../api/game.api';
import { getUserId, setGameId, setIsGM, setTrainer } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';

export default {
    name: 'NotificationModal',
    props: {
        title: {
            default: 'Modal title'
        },
        participants: {
            default: []
        },
        gameId: {
            default: null
        }
    },
    methods: {
        async goTo(){
            if (this.gameId){
                setGameId(this.gameId);
                await findTrainerInGame(this.gameId, getUserId())
                    .then(response => {
                        setTrainer(response.data.trainer);
                        setIsGM(response.data.trainer.isGM);
                        window.location.href = "/";
                    })
                    .catch(generateErrorModal);
            }
        }
    }
}
</script>

<template>
    <div class="modal fade" id="joinModal" tabindex="-1" aria-labelledby="joinModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="joinModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body row">
                    Participants
                    <div v-for="(participant, index) in participants" :key="index">
                        {{participant.isGM ? "GM" : "Trainer"}} - {{participant.trainerName.toUpperCase()}}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="goTo()">Create Player</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setGameId } from '../../utils/localStorage';

export default {
    name: 'JoinModal',
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
        goTo(){
            if (this.gameId){
                setGameId(this.gameId);
                this.$router.push({
                    name: 'JoinGame',
                    params: {
                        gameId: this.gameId,
                        nickname: this.title
                    }
                });
            }
        }
    }
}
</script>

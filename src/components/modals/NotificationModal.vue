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
                    <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="goTo()">To Registration</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

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
        goTo(){
            if (this.gameId){
                this.$router.push({
                    name: 'Registration',
                    params: {
                        isGM: false
                    },
                    query: {
                        gameId: this.gameId
                    }
                })
            }
        }
    }
}
</script>

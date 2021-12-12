<template>
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="goTo()"></button>
                </div>
                <div class="modal-body">
                    {{body}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="goTo()">Close</button>
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
        body: {
            default: '...'
        },
        options: {
            default: '/'
        }
    },
    methods: {
        goTo(){
            if (this.options){
                this.$router.push(this.options)
            }
        }
    }
}
</script>

<template>
    <div class="modal fade" :id="`cellModal_${x}_${y}`" tabindex="-1" :aria-labelledby="`cellModalLabel_${x}_${y}`" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header d-block">
                    <h5 class="modal-title" :id="`cellModalLabel_${x}_${y}`">{{participant.name}}</h5>
                </div>
                <div class="modal-body">
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CellModal',
    props: {
        participant: {},
        x: 0,
        y: 0
    },
    data(){
        return {
            activeParticipant: {}
        }
    }
}
</script>
<template>
    <div class="modal fade show" id="genericModal" tabindex="-1" aria-labelledby="genericModalLabel" style="padding-right: 17px; display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="genericModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">{{body}}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="deleteSelf">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'GenericVisibleModal',
    props: {
        title: {
            default: 'Modal title'
        },
        body: {
            default: '...'
        }
    },
    methods: {
        deleteSelf(){
            document.getElementById('modal-holder').remove();
        }
    }
}
</script>
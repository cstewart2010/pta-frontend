<template>
   <div class="modal fade" id="documentationModal" tabindex="-1" aria-labelledby="documentationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="documentationModalLabel">{{modalName}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <iframe
                    :src="modalSrc"
                    class="pdf-viewer"></iframe>
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
    name:'DocumentationModal',
    props:{
        modalName: {
            default: ''
        },
        modalSrc: {
            default: ''
        }
    }
}
</script>

<style scoped>
    .pdf-viewer {
    height: 100%;
    width: 100%;
    }
</style>
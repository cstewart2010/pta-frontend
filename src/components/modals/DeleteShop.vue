<template>
    <div class="modal fade" :id="'shopConfirmationModal'+shopId" tabindex="-1" aria-labelledby="shopConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="shopConfirmationModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this setting?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="deleteThisShop" data-bs-dismiss="modal">Delete {{shopName}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteShop } from '../../api/shop.api';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'DeleteEncounter',
    props: {
        shopName: {
            default: null
        },
        shopId: {
            default: null
        }
    },
    methods: {        
        async deleteThisShop(){
            await deleteShop(this.shopId)
                .catch(generateErrorModal);
        }
    }
}
</script>
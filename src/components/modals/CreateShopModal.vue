<template>
    <div class="modal fade" id="createShopModal" tabindex="-1" aria-labelledby="createShopModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createShopModalLabel">Create Shop</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <shop-form />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShopForm from './parts/ShopForm.vue'
export default {
    name: 'CreateShop',
    components: {
        ShopForm
    }
}
</script>
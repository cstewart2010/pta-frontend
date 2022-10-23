<template>
    <div class="modal fade" id="updateShopModal" tabindex="-1" aria-labelledby="updateShopModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateShopModalLabel">Update Shop</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <shop-form :shop="shop" v-if="shop" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShopForm from './parts/ShopForm.vue'
export default {
    name: 'UpdateShop',
    components: {
        ShopForm
    },
    props: {
        shop: {
            default: null
        }
    }
}
</script>
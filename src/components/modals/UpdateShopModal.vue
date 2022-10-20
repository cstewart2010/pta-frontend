<template>
    <div class="modal fade" id="updateShopModal" tabindex="-1" aria-labelledby="updateShopModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateShopModalLabel">Create Shop</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <span class="input-group-text">Shops</span>
                        <select class="form-select" v-model="shopId">
                            <option value=""></option>
                            <option v-for="(shop, index) in shops" :key="index" :value="shop.shopId">
                                {{shop.name}}
                            </option>
                        </select>
                        <button class="btn" @click="initialize"
                            ><i :class="`fa fa-refresh`" aria-hidden="true"></i>
                        </button>
                    </div>
                    <shop-form :shopId="shopId" v-if="shopId" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getShops } from '../../api/shop.api'
import ShopForm from './parts/ShopForm.vue'
export default {
    name: 'UpdateShop',
    components: {
        ShopForm
    },
    data(){
        return {
            shops: [],
            shopId: null
        }
    },
    async beforeMount(){
        await this.initialize()
    },
    methods: {
        async initialize(){
            await getShops()
                .then(response => {
                    this.shops = response.data.map(shop => { 
                        return {
                            name: shop.name,
                            shopId: shop.shopId
                        }
                    })
                })
        }
    }
}
</script>
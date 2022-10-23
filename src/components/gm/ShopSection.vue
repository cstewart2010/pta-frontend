<template>
    <div class="my-3" id="shop">
        <div class="d-flex align-items-center">
            <h3 class="text-muted">Shops</h3>
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#createShopModal" title="Add a new shop">
                <i class="fa-solid fa-plus text-muted"></i>
            </button>
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" v-model="toggle">
            </div>
            <button class="btn btn-lg" @click="refresh" title="Refresh shop list" v-if="isEnabled">
                <i :class="'fa fa-refresh'" aria-hidden="true"></i>
            </button>
        </div>
        <div v-show="toggle">
            <div class="row" v-for="(shop, index) in shops" :key="index">
                <button class="btn btn-primary m-1 col-12 col-md"  data-bs-toggle="modal" data-bs-target="#updateShopModal">
                    Update {{shop.name}}
                </button>
                <update-shop :shop="shop" />
                <button class="btn btn-danger m-1 col-12 col-md" data-bs-toggle="modal" :data-bs-target="'#shopConfirmationModal'+shop.shopId">
                    Delete {{shop.name}}
                </button>
                <delete-shop :shopId="shop.shopId" :shopName="shop.name" />
            </div>
            <create-shop />
        </div>
    </div>
</template>

<script>
import { getShops } from '../../api/shop.api'
import CreateShop from '../modals/CreateShopModal.vue'
import UpdateShop from '../modals/UpdateShopModal.vue'
import DeleteShop from '../modals/DeleteShop.vue'
export default {
    name: "ShopSection",
    data(){
        return{
            shops: [],
            isEnabled: true,
            shopId: '',
            toggle: true
        }
    },
    components: {
        CreateShop,
        UpdateShop,
        DeleteShop
    },
    async beforeMount(){
        await this.refresh()
            .catch(console.log);
    },
    methods: {
        async refresh(){
            await getShops()
                .then(response => {
                    this.shops = response.data;
                    this.isEnabled = false;
                    setTimeout(() => this.isEnabled = true, 5000)
                })
        }
    }
}
</script>
<template>
    <div class="my-3" id="shop">
        <div class="d-flex justify-content-between">
            <h3 class="text-secondary">Shops</h3>
            <div class="row" id="buttons">
                <div class="col">
                    <button class="btn btn-lg pe-2" @click="refresh" title="Refresh shop list" v-if="isEnabled">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="col">
                    <button class="btn btn-outline-secondary rounded-circle" data-bs-toggle="modal" data-bs-target="#createShopModal" title="Add a new shop">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="col">
                    <div class="form-check form-switch mt-2">
                        <input type="checkbox" class="form-check-input" v-model="toggle" title="Toggle section visibility">
                    </div>
                </div>
            </div>
        </div>
        <div v-show="toggle && shops.length">
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
        </div>
        <div v-if="!shops.length">
            Here is where your shops will populate
        </div>
        <create-shop />
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
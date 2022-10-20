<template>
    <div v-if="Object.keys(inventory).length">
        <div class="d-flex">
            <div class="col">Name</div>
            <div class="col">Cost</div>
            <div class="col">Description</div>
            <div class="col">Amount in Quantity</div>
            <div class="col" v-if="!isGM">Amount to Buy</div>
        </div>
        <hr>
        <div class="d-flex align-items-center" v-for="(item, name) of inventory" :key="name">
            <div class="col">
                {{name}} (Item Type: {{item.type}})
            </div>
            <div class="col">
                ${{item.cost}}
            </div>
            <div class="col">
                {{item.effects}}
            </div>
            <div class="col" v-if="item.quantity === -1">
                <i class="fa-solid fa-infinity"></i> in stock
            </div>
            <div class="col" v-else>
                {{item.quantity}} in stock
            </div>
            <input type="number" class="col form-control" min="0" :max="item.quantity" v-model="groceries[name].amount" v-if="!isGM">
        </div>
        <button class="btn btn-success" @click="purchase" data-bs-dismiss="modal" v-if="!isGM">Purchase</button>
    </div>
</template>

<script>
import { purchaseFromShop } from '../../api/shop.api';
import { getCellParticipant, getIsGM, setCellParticipant, setTrainer } from '../../utils/localStorage'
export default {
    name: 'ShopSheet',
    props: {
        shopId: {
            default: ''
        }
    },
    data(){
        return {
            inventory: {},
            groceries: {},
            isGM: getIsGM()
        }
    },
    beforeMount(){
        this.inventory = getCellParticipant(this.shopId);
        this.groceries = Object.keys(this.inventory)
            .reduce((curr, key) => {
                const item = this.inventory[key];
                curr[key] = {
                    effects: item.effects,
                    amount: 0,
                    type: item.type
                }

                return curr;
            }, {});
    },
    methods: {
        async purchase(){
            const groceries = Object.keys(this.groceries)
                .map(key => {
                    return {
                        name: key,
                        ...this.groceries[key]
                    }
                });
            
            await purchaseFromShop(this.shopId, groceries)
                .then(response => {
                    setTrainer(response.data.trainer)
                    setCellParticipant(this.shopId, response.data.shop.inventory)
                    this.inventory = response.data.shop.inventory
                })
                .catch(console.log)
        }
    }
}
</script>
<template>
    <form :id="addShopFormId" class="row needs-validation" @submit.prevent="addShop">
        <h5>Add Shop</h5>
        <div class="col-4">
            <select id="add-shop-id" class="form-select" v-model="shopSelection" required>
                <option value="" selected disabled></option>
                <option v-for="(shop, index) in shops" :key="index" :value="index + 1">
                    {{shop.name}}
                </option>
            </select>
            <label for="add-shop-id" class="form-label">Shop</label>
        </div>
        <div class="col-4">
            <input id="add-shop-x" class="form-control" type="number" min="0" :max="length" v-model="x" required>
            <label for="add-shop-x" class="form-label">x-coordinate</label>
            <validation-feedback name="X coordinate" :useInvalid="false" />
        </div>
        <div class="col-4">
            <input id="add-shop-y" class="form-control" type="number" min="0" :max="length" v-model="y" required>
            <label for="add-shop-y" class="form-label">y-coordinate</label>
            <validation-feedback name="Y coordinate" :useInvalid="false" />
        </div>
        <div class="col-12">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="submit">Add</button>
        </div>
    </form>
    <hr>
</template>

<script>
import ValidationFeedback from '../../partials/ValidationFeedback.vue'
import { addToActiveEncounter } from '../../../api/setting.api';
import { checkValidation, removeValidation } from '../../../utils/credentials';
import { generateErrorModal } from '../../../utils/modalUtil';
export default {
    name: 'AddShop',
    props: {
        socket:{
            default: {}
        },
        encounterMap: {
            default: [[]]
        },
        shops: {
            default: []
        }
    },
    components:{
        ValidationFeedback
    },
    data(){
        return {
            addShopFormId: 'add-shop',
            shopSelection: 0,
            length: 15,
            x: 0,
            y: 0
        }
    },
    methods: {
        async addShop(){
            if (!checkValidation(this.addShopFormId)){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }

            const shop = this.shops[this.shopSelection - 1];
            await addToActiveEncounter({
                participantId: shop.shopId,
                name: shop.name,
                health: "Feeling fresh!",
                type: "Shop",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: 0
            })
            .then(() => {
                removeValidation(this.addShopFormId);
                this.socket.send("")
            })
            .catch(generateErrorModal)
        },
    }
}
</script>
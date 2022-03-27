<template>
    <div class="col-12 col-md-6 bg-secondary bg-opacity-50 text-dark" style="text-align: center;">
        <div class="row">
            <strong class="col-12 bg-secondary border-bottom border-start">
                Key Items
            </strong>
        </div>
        <div class="row">
            <div class="col-3 border-bottom border-start">
                Name
            </div>
            <div class="col-1 border-bottom border-start">
                Qty
            </div>
            <div class="col-8 border-bottom border-start">
                Description
            </div>
        </div>
        <div class="row" v-for="(item, index) in items" :key="index">
            <div class="col-3 border-bottom border-start">
                {{item.name}}
            </div>
            <button class="col-1 btn text-dark border-bottom border-start" @click="setUseItem(item)"  data-bs-toggle="modal" data-bs-target="#useItemModal-key">
                {{item.amount}}
            </button>
            <div class="col-8 border-bottom border-start">
                {{item.effects}}
            </div>
        </div>
        <div class="row border-bottom border-start">
            <select class="form-select m-1 col text-dark bg-secondary bg-opacity-25" name="item" style="max-width: 150px" v-model="addedItem">
                <option v-for="(item, index) in availableItems" :key="index" :id="item" :value="index + 1">
                    {{item}}
                </option>
            </select>
            <input type="number" class="m-1 form-control col text-dark bg-secondary bg-opacity-25"  min="1" name="item-amount" id="item-amount" v-model="addedAmount">
            <button class="btn m-1 col text-dark" @click="addItem">Add more items</button>
        </div>
    </div>
    <use-item-modal :item="itemToUse" :type="'key'" />
</template>

<script>
import { getAllKeyItems, getKeyItem } from '../../../api/dex.api'
import { addItems } from '../../../api/trainer.api'
import { getTrainer, setPTAActivityToken } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
import UseItemModal from '../../modals/UseItemModal.vue'
export default {
    name: 'KeyItems',
    data(){
        return {
            items: null,
            availableItems: [],
            addedItem: "",
            addedAmount: 1,
            itemToUse: {
                name: '',
                amount: 0
            }
        }
    },
    components: {
        UseItemModal
    },
    beforeMount: async function(){
        await getAllKeyItems()
            .then(response => {
                this.items = getTrainer().items
            .filter(item => item.type == 'Key')
                this.availableItems = response.data.results.map(item => item.name)
            })
    },
    methods: {
        async addItem(){
            await getKeyItem(this.addedItem)
            .then(async response => {
                const item = {
                    Name: response.data.name,
                    Amount: this.addedAmount,
                    Effects: response.data.effects,
                    Type: "Key"
                }

                await addItems([item])
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
            })
            .catch(generateErrorModal);
        },
        setUseItem(item){
            this.itemToUse = item;
        }
    }
}
</script>
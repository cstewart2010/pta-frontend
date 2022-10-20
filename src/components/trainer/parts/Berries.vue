<template>
    <div class="col-12 col-md-6 text-dark bg-success bg-opacity-50" style="text-align: center;">
        <div class="row">
            <strong class="col-12 bg-success border-bottom border-start">
                Berries
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
            <button class="col-1 btn text-dark border-bottom border-start" @click="setUseItem(item)"  data-bs-toggle="modal" data-bs-target="#useItemModal-berry">
                {{item.amount}}
            </button>
            <div class="col-8 border-bottom border-start">
                {{item.effects}}
            </div>
        </div>
        <div class="row border-bottom border-start" v-if="isGM">
            <select class="form-select m-1 col bg-success bg-opacity-25" name="item" style="max-width: 150px" v-model="addedItem">
                <option v-for="(item, index) in availableItems" :key="index" :id="item" :value="item">
                    {{item}}
                </option>
            </select>
            <input type="number" class="m-1 form-control col text-dark bg-success bg-opacity-25"  min="1" name="item-amount" id="item-amount" v-model="addedAmount">
            <button class="btn m-1 col text-dark" @click="addItem">Add more items</button>
        </div>
    </div>
    <use-item-modal :item="itemToUse" :type="'berry'" />
</template>

<script>
import { getAllBerries, getBerry } from '../../../api/dex.api'
import { addItems } from '../../../api/trainer.api'
import { getIsGM, getTrainer, setPTAActivityToken } from '../../../utils/localStorage'
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
            },
            isGM: getIsGM()
        }
    },
    components: {
        UseItemModal
    },
    beforeMount: async function(){
        await getAllBerries()
            .then(response => {
                this.items = getTrainer().items
            .filter(item => item.type == 'Berry')
                this.availableItems = response.data.results.map(item => item.name)
            })
    },
    methods: {
        async addItem(){
            await getBerry(this.addedItem)
            .then(async response => {
                const item = {
                    Name: response.data.name,
                    Amount: this.addedAmount,
                    Effects: response.data.effects,
                    Type: "Berry"
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
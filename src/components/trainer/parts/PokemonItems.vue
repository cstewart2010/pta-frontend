<template>
    <div class="col-12 col-md-6 bg-warning bg-gradient text-dark" style="text-align: center;">
        <div class="row">
            <strong class="col-12 border-bottom border-start">
                Pokemon Items
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
            <button class="col-1 btn btn-warning bg-gradient border-bottom border-start" @click="setUseItem(item)"  data-bs-toggle="modal" data-bs-target="#useItemModal-pokemon">
                {{item.amount}}
            </button>
            <div class="col-8 border-bottom border-start">
                {{item.effects}}
            </div>
        </div>
        <div class="row border-bottom border-start">
            <select class="form-select m-1 col text-dark bg-warning" name="item" style="max-width: 150px" v-model="addedItem">
                <option v-for="(item, index) in availableItems" :key="index" :id="item" :value="index + 1">
                    {{item}}
                </option>
            </select>
            <input type="number" class="m-1 col text-dark bg-warning bg-gradient"  min="1" name="item-amount" id="item-amount" v-model="addedAmount">
            <button class="btn btn-warning bg-gradient m-1 col text-dark" @click="addItem">Add more items</button>
        </div>
    </div>
    <use-item-modal :item="itemToUse" :type="'pokemon'" />
</template>

<script>
import { getAllPokemonItems, getPokemonItem } from '../../../api/dex.api'
import { addItems } from '../../../api/trainer.api'
import { getTrainer, setPTAActivityToken } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
import UseItemModal from '../../modals/UseItemModal.vue'
export default {
    name: 'PokemonItems',
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
        await getAllPokemonItems()
            .then(response => {
                this.items = getTrainer().items
            .filter(item => item.type == 'Pokemon')
                this.availableItems = response.data.results.map(item => item.name)
            })
    },
    methods: {
        async addItem(){
            await getPokemonItem(this.addedItem)
            .then(async response => {
                const item = {
                    Name: response.data.name,
                    Amount: this.addedAmount,
                    Effects: response.data.effects,
                    Type: "Pokemon"
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
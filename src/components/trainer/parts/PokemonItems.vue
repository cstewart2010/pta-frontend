<template>
    <div class="col-12 col-md-6 bg-warning bg-opacity-50 text-dark" style="text-align: center;">
        <div class="row">
            <strong class="col-12 bg-warning border-bottom border-start">
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
            <div class="col-1 btn border-bottom border-start">
                {{item.amount}}
            </div>
            <div class="col-8 border-bottom border-start">
                {{item.effects}}
            </div>
        </div>
        <div class="row border-bottom border-start" v-if="isGM && availableItems">
            <select class="form-select m-1 col text-dark bg-warning bg-opacity-25" name="item" style="max-width: 150px" v-model="addedItem">
                <option v-for="(item, index) in availableItems" :key="index" :id="item" :value="index + 1">
                    {{item}}
                </option>
            </select>
            <input type="number" class="m-1 form-control col text-dark bg-warning bg-opacity-25"  min="1" name="item-amount" id="item-amount" v-model="addedAmount">
            <button class="btn m-1 col text-dark" @click="addItem">Add more items</button>
        </div>
    </div>
</template>

<script>
import { getAllPokemonItems, getPokemonItem } from '../../../api/dex.api'
import { addItems } from '../../../api/trainer.api'
import { getDBPokemonItems, getIsGM, getTrainer, setDBPokemonItems, setPTAActivityToken } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
export default {
    name: 'PokemonItems',
    data(){
        return {
            items: getTrainer().items.filter(item => item.type == 'Pokemon'),
            availableItems: getDBPokemonItems(),
            addedItem: "",
            addedAmount: 1,
            itemToUse: {
                name: '',
                amount: 0
            },
            isGM: getIsGM()
        }
    },
    async beforeMount(){
        if (!this.availableItems && this.isGM){
            await getAllPokemonItems()
                .then(response => {
                    this.availableItems = response.data.results.map(item => item.name)
                    setDBPokemonItems(this.availableItems)
                })
        }
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
                })
            })
            .catch(generateErrorModal);
        }
    }
}
</script>
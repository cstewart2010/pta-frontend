<template>
    <div class="col-12 col-md-6 text-dark bg-info bg-opacity-50" style="text-align: center;">
        <div class="row">
            <strong class="col-12 bg-info border-bottom border-start">
                Pokeballs
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
            <div class="col-1 border-bottom border-start">
                {{item.amount}}
            </div>
            <div class="col-8 border-bottom border-start">
                {{item.effects}}
            </div>
        </div>
        <div class="row border-bottom border-start" v-if="isGM && availableItems">
            <select class="form-select m-1 col text-dark bg-info bg-opacity-25" name="item" style="max-width: 150px" v-model="addedItem">
                <option v-for="(item, index) in availableItems" :key="index" :id="item" :value="item">
                    {{item}}
                </option>
            </select>
            <input type="number" class="m-1 form-control col text-dark bg-info bg-opacity-25"  min="1" name="item-amount" id="item-amount" v-model="addedAmount">
            <button class="btn m-1 col text-dark" @click="addItem">Add more items</button>
        </div>
    </div>
</template>

<script>
import { getAllPokeballItems, getPokeballItem } from '../../../api/dex.api'
import { addItems } from '../../../api/trainer.api'
import { getDBPokeballs, getIsGM, getTrainer, setDBPokeballs, setPTAActivityToken } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
export default {
    name: 'Pokeballs',
    data(){
        return {
            items: getTrainer().items.filter(item => item.type == 'Pokeball'),
            availableItems: getDBPokeballs(),
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
            await getAllPokeballItems()
                .then(response => {
                    this.availableItems = response.data.results.map(item => item.name)
                    setDBPokeballs(this.availableItems)
                })
        }
    },
    methods: {
        async addItem(){
            await getPokeballItem(this.addedItem)
            .then(async response => {
                const item = {
                    Name: response.data.name,
                    Amount: this.addedAmount,
                    Effects: response.data.effects,
                    Type: "Pokeball"
                }

                await addItems([item])
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
            })
            .catch(generateErrorModal);
        }
    }
}
</script>
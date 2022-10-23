<template>
    <form :id="formId" class="needs-validation" @submit.prevent="post" novalidate>
        <div class="input-group my-2">
            <span class="input-group-text">Name:</span>
            <input class="form-control" type="text" v-model="shopName" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
            <validation-feedback name="Shop name" />
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="isActive" id="isActiveCheckbox">
            <label class="form-check-label" for="isActiveCheckbox">Activate {{shopName}}</label>
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Add an item:</span>
            <select class="form-select" v-model="type" @change="chooseItemList">
                <option value="" disabled selected></option>
                <option value="Key">Key</option>
                <option value="Medical">Medical</option>
                <option value="Pokeball">Pokeball</option>
                <option value="Pokemon">Pokemon</option>
                <option value="Trainer">Trainer</option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(keyItems)" v-if="type == 'Key'" >
                <option value="" disabled selected></option>
                <option v-for="(item, index) in keyItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(medicalItems)" v-else-if="type == 'Medical'">
                <option value="" disabled selected></option>
                <option v-for="(item, index) in medicalItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(pokeballs)" v-else-if="type == 'Pokeball'">
                <option value="" disabled selected></option>
                <option v-for="(item, index) in pokeballs" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(pokemonItems)" v-else-if="type == 'Pokemon'">
                <option value="" disabled selected></option>
                <option v-for="(item, index) in pokemonItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(trainerItems)" v-else-if="type == 'Trainer'">
                <option value="" disabled selected></option>
                <option v-for="(item, index) in trainerItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <span class="input-group-text">Cost:</span>
            <input class="form-control" type="number" min="1" v-model="cost">
            <span class="input-group-text">Quantity:</span>
            <input class="form-control" type="number" min="-1" v-model="quantity">
            <button class="btn btn-secondary" type="button" @click="addItem">
                Add
            </button>
        </div>
        <button type="submit" class="btn btn-primary mx-1">Post</button>
        <button type="button" class="btn btn-secondary mx-1" data-bs-dismiss="modal" @click="refresh">Close</button>
    </form>
    <shop-list :inventory="inventory" />
</template>

<script>
import { getAllKeyItems, getAllMedicalItems, getAllPokeballItems, getAllPokemonItems, getAllTrainerEquipment, getKeyItem, getMedicalItem, getPokeballItem, getPokemonItem, getTrainerEquipment } from '../../../api/dex.api';
import { createShop, updateShop } from '../../../api/shop.api';
import { checkValidation, removeValidation } from '../../../utils/credentials';
import { shopData } from '../../../utils/initialStates'
import { generateErrorModal } from '../../../utils/modalUtil';
import ShopList from './ShopList.vue'
    import ValidationFeedback from "../../partials/ValidationFeedback.vue"
export default {
    name: 'ShopForm',
    props: {
        shop: {
            default: null
        }
    },
    data(){
        return {
            keyItems: [],
            medicalItems: [],
            pokeballs: [],
            pokemonItems: [],
            trainerItems: [],
            formId: 'shop-form',
            ...shopData()
        }
    },
    components: {
        ShopList,
        ValidationFeedback
    },
    async beforeMount(){
        await getAllKeyItems()
            .then(response => this.keyItems = response.data.results);
        await getAllMedicalItems()
            .then(response => this.medicalItems = response.data.results);
        await getAllPokeballItems()
            .then(response => this.pokeballs = response.data.results);
        await getAllPokemonItems()
            .then(response => this.pokemonItems = response.data.results);
        await getAllTrainerEquipment()
            .then(response => this.trainerItems = response.data.results);
        if (this.shop){
            this.shopName = this.shop.name;
            this.isActive = this.shop.isActive;
            this.inventory = this.shop.inventory;
        }
    },
    methods: {
        chooseItemList(){
            this.itemName = null
        },
        async chooseItem(itemList){
            var thing = itemList.find(thing => thing.name == this.itemName)
            if (!thing){
                return
            }
            let item = null
            switch (this.type){
                case "Key":
                    await getKeyItem(this.itemName)
                        .then(response => item = response.data)
                    break;
                case "Medical":
                    await getMedicalItem(this.itemName)
                        .then(response => item = response.data)
                    break;
                case "Pokeball":
                    await getPokeballItem(this.itemName)
                        .then(response => item = response.data)
                    break;
                case "Pokemon":
                    await getPokemonItem(this.itemName)
                        .then(response => item = response.data)
                    break;
                case "Trainer":
                    await getTrainerEquipment(this.itemName)
                        .then(response => item = response.data)
                    break;
            }
            if (item){
                this.cost = item.price
                this.effects = item.effects
            }
        },
        addItem(){
            if (this.itemName){
                if (this.inventory[this.itemName] && this.inventory[this.itemName].type == this.type){
                    this.inventory[this.itemName].quantity += this.quantity
                }
                else {
                    this.inventory[this.itemName] = {
                        cost: this.cost,
                        effects: this.effects,
                        type: this.type,
                        quantity: this.quantity
                    }
                }
            }
        },
        async post(){
            if (!checkValidation(this.formId)){
                return;
            }
            removeValidation(this.formId)
            if (this.shop){
                await this.update()
            }
            else {
                await this.create()
            }
        },
        async create(){
            var shop = {
                name: this.shopName,
                isActive: this.isActive,
                inventory: this.inventory
            }
            await createShop(shop)
                .then(this.refresh)
                .catch(generateErrorModal);
        },
        async update(){
            var shop = {
                name: this.shopName,
                isActive: this.isActive,
                inventory: this.inventory
            }
            await updateShop(this.shop.shopId, shop)
                .then(this.refresh)
                .catch(generateErrorModal);
        },
        refresh(){
            if (!this.shop){
                Object.assign(this.$data, shopData())
            }
        }
    }
}
</script>
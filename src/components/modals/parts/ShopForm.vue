<template>
    <form @submit.prevent="post">
        <div class="input-group my-2">
            <span class="input-group-text">Name:</span>
            <input class="form-control" type="text" v-model="shopName">
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="isActive" id="isActiveCheckbox">
            <label class="form-check-label" for="isActiveCheckbox">Activate {{shopName}}</label>
        </div>
        <div class="input-group my-2">
            <span class="input-group-text">Add an item:</span>
            <select class="form-select" v-model="type" @select="chooseItemList">
                <option value=""></option>
                <option value="Key">Key</option>
                <option value="Medical">Medical</option>
                <option value="Pokeball">Pokeball</option>
                <option value="Pokemon">Pokemon</option>
                <option value="Trainer">Trainer</option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(keyItems)" v-if="type == 'Key'">
                <option value=""></option>
                <option v-for="(item, index) in keyItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(medicalItems)" v-else-if="type == 'Medical'">
                <option value=""></option>
                <option v-for="(item, index) in medicalItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(pokeballs)" v-else-if="type == 'Pokeball'">
                <option value=""></option>
                <option v-for="(item, index) in pokeballs" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(pokemonItems)" v-else-if="type == 'Pokemon'">
                <option value=""></option>
                <option v-for="(item, index) in pokemonItems" :key="index" :value="item.name">
                    {{item.name}}
                </option>
            </select>
            <select class="form-select" v-model="itemName" @change="chooseItem(trainerItems)" v-else-if="type == 'Trainer'">
                <option value=""></option>
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
        <button type="button" class="btn btn-danger mx-1" @click="deleteIt" data-bs-dismiss="modal" v-if="shopId">Delete</button>
        <button type="button" class="btn btn-secondary mx-1" data-bs-dismiss="modal" @click="refresh">Close</button>
    </form>
    <shop-list :inventory="inventory" />
</template>

<script>
import { getAllKeyItems, getAllMedicalItems, getAllPokeballItems, getAllPokemonItems, getAllTrainerEquipment, getKeyItem, getMedicalItem, getPokeballItem, getPokemonItem, getTrainerEquipment } from '../../../api/dex.api';
import { createShop, deleteShop, getShopGM, updateShop } from '../../../api/shop.api';
import { shopData } from '../../../utils/initialStates'
import { generateErrorModal } from '../../../utils/modalUtil';
import ShopList from './ShopList.vue'
export default {
    name: 'ShopForm',
    props: {
        shopId: {
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
            ...shopData()
        }
    },
    components: {
        ShopList
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
        if (this.shopId){
            await getShopGM(this.shopId)
                .then(response => {
                    this.shopName = response.data.name;
                    this.isActive = response.data.isActive;
                    this.inventory = response.data.inventory;
                })
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
            if (this.shopId){
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
            await updateShop(this.shopId, shop)
                .then(this.refresh)
                .catch(generateErrorModal);
        },
        async deleteIt(){
            await deleteShop(this.shopId)
                .then(() => Object.assign(this.$data, shopData()))
                .catch(generateErrorModal);
        },
        refresh(){
            if (!this.shopId){
                Object.assign(this.$data, shopData())
            }
        }
    }
}
</script>
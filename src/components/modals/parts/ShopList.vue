<template>
    <div v-if="Object.keys(inventory).length">
        Inventory
        <div class="row" v-for="(item, name) of inventory" :key="name">
            <div class="col">
                {{name}} (Item Type: {{item.type}})
            </div>
            <div class="col">
                ${{item.cost}}
            </div>
            <div class="col">
                {{item.quantity}} in stock
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShopList',
    props: {
        inventory: {
            default: {}
        }
    }
}
</script>
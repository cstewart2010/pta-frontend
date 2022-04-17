<template>
    <div v-if="encounter.encounterId != null">
        <h1>{{encounter.name}} Map</h1>
        <div class="row" v-for="row in encounterMap" :key="row">
            <button :class="'col border border-dark btn grid-cell ' + cell" v-for="cell in row" :key="cell">
            </button>
        </div>
    </div>
</template>

<script>
import { getGameId, getIsGM } from '../utils/localStorage'
import { getActiveEncounter } from '../api/encounter.api'
import { generateErrorModal } from '../utils/modalUtil'
export default {
    name: "Encounter",
    data() {
        return {
            isGM: getIsGM(),
            length: 16,
            encounterMap: [],
            gameId: getGameId(),
            encounter: {}
        }
    },
    async beforeMount(){
        for (let i = 0; i < this.length; i++){
            this.encounterMap[i] = [];
            for (let j = 0; j < this.length; j++){
                this.encounterMap[i][j] = null
            }
        }
        this.encounterMap[5][13] = "bg-primary";
        this.encounter = await this.getEncounter();
        console.log(this.encounter)
    },
    methods: {
        async getEncounter(){
            return await getActiveEncounter(this.gameId)
                .then(response => response.data)
                .catch(generateErrorModal)
        }
    }
}
</script>

<style scoped>
.grid-cell {
    width: 75px;
    height: 75px;
}
</style>
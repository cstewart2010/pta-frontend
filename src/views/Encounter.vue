<template>
    <div v-if="encounter.encounterId != null">
        <h1>{{encounter.name}} Map</h1>
        <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
            <button :class="'col border border-dark btn grid-cell ' + cellData.color" v-for="(cellData, columnIndex) in row" :key="`${rowIndex}_${columnIndex}`">
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
            encounterMap: [
                [
                    {
                        color: null,
                        participant: {}
                    }
                ]
            ],
            gameId: getGameId(),
            encounter: {}
        }
    },
    async beforeMount(){
        for (let i = 0; i < this.length; i++){
            this.encounterMap[i] = [];
            for (let j = 0; j < this.length; j++){
                this.encounterMap[i][j] = {
                    color: null,
                    participant: {}
                }
            }
        }
        this.encounterMap[5][13].color = "bg-primary";
        this.encounter = await this.getEncounter();
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
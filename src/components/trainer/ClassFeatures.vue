<template>
    <spinner v-if="!isReady" />
    <ag-grid-vue
        style="width: 50vw; height: 75vh"
        class="ag-theme-alpine w-100"
        :columnDefs="columnDefs"
        :rowData="featureData"
        :rowHeight="500"
        v-else-if="columnDefs.length"
    />
</template>

<script>
import { getGeneralFeature, getTrainerClass } from '../../api/dex.api';
import { getTrainer } from '../../utils/localStorage'
import { generateErrorModal } from '../../utils/modalUtil';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import Spinner from '../partials/Spinner.vue'

export default {
    name: "ClassFeatures",
    components:{
        AgGridVue,
        Spinner
    },
    data(){
        return{
            featureData: [],
            columnDefs: [],
            isReady: false
        }
    },
    async beforeMount(){
        let current = {};
        const trainer = getTrainer();
        const temp = []
        const temp2 = []
        for (let i = 0; i < trainer.level + 2; i++){
            temp2[i] = {}
        }
        let levelComparer = trainer.level
        let nextComparer = -1
        for (const trainerClass of trainer.trainerClasses){
            if (levelComparer < 0){
                break;
            }
            if (trainerClass.length == 0){
                nextComparer++;
                if (nextComparer == 0){
                    levelComparer = levelComparer - 2
                }
                levelComparer = levelComparer - (4 * nextComparer);
                continue;
            }
            await getTrainerClass(trainerClass)
                .then(response => {
                    temp.push({
                        headerName: trainerClass,
                        field: trainerClass,
                        autoHeight: true,
                        wrapText: true,
                        maxWidth: 150
                    })
                    temp.push({
                        headerName: 'Effect',
                        field: `${trainerClass}effect`,
                        autoHeight: true,
                        wrapText: true,
                        resizable: true,
                        minWidth: 400
                    })
                    temp2[0][trainerClass] = 'Starting'
                    temp2[0][`${trainerClass}effect`] = response.data.skills
                    current = {
                        name: response.data.name,
                        feats: response.data.feats.filter(feat => feat.levelLearned <= levelComparer)
                    }
                    nextComparer++;
                    if (nextComparer == 0){
                        levelComparer = levelComparer - 2
                    }
                    levelComparer = levelComparer - (4 * nextComparer);
                })
                .catch(generateErrorModal)
            let thing = 1
            for (const feature of current.feats){
                await getGeneralFeature(feature.name)
                    .then(response => {
                        temp2[thing][trainerClass] = response.data.name
                        temp2[thing][`${trainerClass}effect`] = response.data.effects
                        thing++;
                    })
                    .catch(alert)
            }
        }

        this.columnDefs = temp;
        this.featureData = temp2;
        this.isReady = true
    }
}
</script>
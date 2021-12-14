<template>
    <ag-grid-vue
        style="width: 50vw; height: 75vh"
        class="ag-theme-alpine w-100"
        :columnDefs="columnDefs"
        :rowData="featureData"
        :rowHeight="500"
    />
</template>

<script>
import { getGeneralFeature, getTrainerClass } from '../../api/dex.api';
import { getTrainer } from '../../utils/localStorage'
import { generateErrorModal } from '../../utils/modalUtil';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: "ClassFeatures",
    data(){
        return {
            trainer: getTrainer(),
            featureData: [],
            columnDefs: []
        }
    },
    components:{
        AgGridVue
    },
    beforeMount:async function(){
        let current = {};
        const temp = [];
        let levelComparer = this.trainer.level
        let nextComparer = -1
        for (const trainerClass of this.trainer.trainerClasses){
            if (levelComparer < 0){
                break;
            }
            await getTrainerClass(trainerClass)
                .then(response => {
                    this.columnDefs.push({
                        headerName: trainerClass,
                        field: trainerClass,
                        autoHeight: true,
                        wrapText: true,
                        maxWidth: 150
                    })
                    this.columnDefs.push({
                        headerName: 'Effect',
                        field: `${trainerClass}effect`,
                        autoHeight: true,
                        wrapText: true,
                        resizable: true,
                        cellStyle: {
                            'line-height': 2
                        }
                    })
                    const starting = {};
                    starting[trainerClass] = 'Starting'
                    starting[`${trainerClass}effect`] = response.data.skills
                    temp.push(starting);
                    current = {
                        name: response.data.name,
                        feats: response.data.feats.filter(feat => feat.levelLearned <= levelComparer)
                    }
                    nextComparer++;
                    levelComparer = levelComparer - 2 - (4 * nextComparer);
                })
                .catch(generateErrorModal)
            for (const feature of current.feats){
                await getGeneralFeature(feature.name)
                    .then(response => {
                        const thing = {}
                        thing[trainerClass] = response.data.name
                        thing[`${trainerClass}effect`] = response.data.effects
                        temp.push(thing);
                    })
                    .catch(generateErrorModal)
            }
            this.featureData = temp;
        }
    }
}
</script>
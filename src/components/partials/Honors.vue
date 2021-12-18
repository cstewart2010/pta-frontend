<template>
    <div class="text-center">
        <h3>Honors</h3>
        <div class="row d-flex flex-wrap flex-row justify-content-evenly">
            <div class="col-md-4" v-for="(honor, index) in honors" :key="index">
                {{honor}}
            </div>
            <div class="col-md-4">
                Earned {{Math.floor(caughtTotal / 30)}} additional honors from PokeDex<br>
                Completion status: {{Math.round(10000 * caughtTotal / dexTotal)/100}}%
            </div>
        </div>
        <h3>PokeDex</h3>
        <div class="row d-flex flex-wrap flex-row justify-content-evenly">
            <ag-grid-vue
                style="width: 528px; height: 660px"
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="pokeDex"
            />
        </div>
    </div>
</template>

<script>
import { getAllPokemon } from '../../api/dex.api';
import { getTrainer } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: 'Honors',
    components: {
        AgGridVue
    },
    data() {
        return {
            caughtTotal: 0,
            dexTotal: 1,
            honors: [],
            pokeDex: [],
            columnDefs: [
                {
                    headerName: "Species",
                    field: "species",
                    autoHeight: true,
                    maxWidth: 150,
                    filter: "agTextColumnFilter"
                },
                {
                    headerName: "Seen",
                    field: "seen",
                    autoHeight: true,
                    maxWidth: 150,
                    filter: "agTextColumnFilter"
                },
                {
                    headerName: "Caught",
                    field: "caught",
                    autoHeight: true,
                    filter: "agTextColumnFilter"
                },
            ]
        }
    },
    beforeMount:async function(){
        const trainer = getTrainer();
        this.caughtTotal = trainer.caughtTotal;
        this.honors = trainer.honors;
        await getAllPokemon()
            .then(response => {
                this.dexTotal = response.data.count
                this.pokeDex = trainer.pokeDex.map(item => {
                    return {
                        species: response.data.results[item.dexNo - 1].name,
                        seen: "x",
                        caught: item.isCaught ? "x": null
                    }
                });
            })
            .catch(generateErrorModal);
    }
}
</script>
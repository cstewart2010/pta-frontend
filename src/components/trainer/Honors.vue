<template>
    <div class="text-center" v-if="isReady">
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
    <spinner v-else />
</template>

<script>
import { getDBFullPokedex, getTrainer, setDBFullPokedex } from '../../utils/localStorage';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import Spinner from '../partials/Spinner.vue'
import { getAllBasePokemon } from '../../api/dex.api';

export default {
    name: 'Honors',
    components: {
        AgGridVue,
        Spinner
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
            ],
            isReady: false
        }
    },
    async beforeMount(){
        const trainer = getTrainer();
        this.caughtTotal = trainer.caughtTotal;
        this.honors = trainer.honors;
        let fullPokedex = getDBFullPokedex();
        if (!fullPokedex){
            fullPokedex = await getAllBasePokemon()
                .then(response => response.data)
            
            setDBFullPokedex(fullPokedex)
        }

        const pokedex = fullPokedex
            .reduce((curr, next) => {
                if (!curr.includes(next.name)){
                    curr.push(next.name)
                }

                return curr
            }, [])
        
        this.dexTotal = pokedex.length
        this.pokeDex = trainer.pokeDex.map(item => {
            return {
                species: pokedex[item.dexNo - 1],
                seen: "x",
                caught: item.isCaught ? "x": null
            }
        });
        
        this.isReady = true
    }
}
</script>
<template>
    <h1>The Journey so far</h1>
    <div class="row">
        <div v-for="(log, index) in logs" :key="index">
            {{log.user.toUpperCase()}} {{log.action}}
        </div>
        <div class="input-group mb-3">
            <input type="number" min="1" name="page-number" :max="allLogs.length" v-model="page" @change="changePage" style="width: 75px">
            <span class="input-group-text" id="basic-addon2">of {{allLogs.length}} {{conjugation}}</span>
        </div>
        <label for="page-number"></label>
    </div>
</template>

<script>
import { getAllLogs, getLogs } from '../api/game.api'
import { getGameId, getIsGM } from '../utils/localStorage'
export default {
    name: "Journal",
    data() {
        return {
            gameId: getGameId(),
            logs: [],
            allLogs: [],
            page: 1,
            conjugation: ''
        }
    },
    beforeMount: async function(){
        if (getIsGM()){
            await getAllLogs(this.gameId)
                .then(response => {
                    console.log(response.data.logPages)
                    this.allLogs = response.data.logPages;
                })
        }
        else {
            await getLogs(this.gameId)
                .then(response =>{
                    this.allLogs = [response.data];
                })
        }
        this.conjugation = this.allLogs.length > 1 ? 'pages' : 'page'
        this.changePage();
    },
    methods: {
        changePage(){
            if (this.page < 1 || this.page > this.allLogs.length){
                return;
            }

        this.logs = this.allLogs[this.page - 1];
        }
    }
}
</script>
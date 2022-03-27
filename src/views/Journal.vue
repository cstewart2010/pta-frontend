<template>
    <div class="row">
        <div class="input-group my-3" v-if="isGM">
            <button class="btn btn-secondary" @click="refreshLogs">Refresh</button>
            <input type="number" min="1" name="page-number-top" :max="allLogs.length" v-model="page" @change="changePage" style="width: 75px">
            <span class="input-group-text">of {{allLogs.length}} {{conjugation}}</span>
        </div>
        <button class="btn btn-secondary col-4 my-3" @click="refreshLogs" v-else>Refresh</button>
        <div class="border-bottom border-dark" v-for="(log, index) in logs" :key="index">
            {{log.user.toUpperCase()}} {{log.action}}
        </div>
        <div class="input-group my-3" v-if="isGM">
            <button class="btn btn-secondary" @click="refreshLogs">Refresh</button>
            <input type="number" min="1" name="page-number-bottom" :max="allLogs.length" v-model="page" @change="changePage" style="width: 75px" v-if="isGM">
            <span class="input-group-text">of {{allLogs.length}} {{conjugation}}</span>
        </div>
        <button class="btn btn-secondary col-4 my-3" @click="refreshLogs" v-else>Refresh</button>
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
            conjugation: '',
            isGM: false
        }
    },
    beforeMount: async function(){
        this.isGM = getIsGM();
        await this.refreshLogs();
    },
    methods: {
        changePage(){
            if (this.page < 1 || this.page > this.allLogs.length){
                return;
            }

            this.logs = this.allLogs[this.page - 1];
        },
        async refreshLogs(){
            if (this.isGM){
                await getAllLogs(this.gameId)
                    .then(response => {
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
        }
    }
}
</script>
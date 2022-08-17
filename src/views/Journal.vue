<template>
    <div class="input-group my-1" v-if="!isGM">
        <button class="btn btn-secondary" @click="sendLog">Roll</button>
        <input class="w-50" type="number" min="1" max="10" v-model="diceNumber">
        <select class="form-select" v-model="dice">
            <option value="2" selected>d2</option>
            <option value="4">d4</option>
            <option value="6">d6</option>
            <option value="8">d8</option>
            <option value="10">d10</option>
            <option value="12">d12</option>
            <option value="20">d20</option>
        </select>
    </div>
    <div class="input-group my-1" v-else>
        <button class="btn btn-secondary" @click="sendAlert">Send Alert</button>
        <input type="text" v-model="alert">
    </div>
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
import { getAllLogs, getLogs, postLog } from '../api/game.api'
import { getGameId, getIsGM, getTrainer, setPTAActivityToken } from '../utils/localStorage'
export default {
    name: "Journal",
    data() {
        return {
            gameId: getGameId(),
            logs: [],
            allLogs: [],
            page: 1,
            conjugation: '',
            isGM: false,
            dice: 2,
            diceNumber: 1,
            alert: ''
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
        },
        async sendLog(){
            if (this.diceNumber > 0 && this.diceNumber < 11){
                var rolls = [];
                for (var i = 0; i < this.diceNumber; i++){
                    rolls[i] = Math.ceil(Math.random()*this.dice)
                }
            }
            await postLog({
                User: getTrainer().trainerName,
                Action: `rolled ${this.diceNumber}d${this.dice}: ${rolls}`
            })
            .then(response => {
                setPTAActivityToken(response.headers['pta-activity-token']);
                this.refreshLogs();
            })
        },
        async sendAlert(){
            if (this.alert){
                await postLog({
                    User: "NEW GM ALERT:",
                    Action: this.alert
                })
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.refreshLogs();
                })
            }
        }
    }
}
</script>
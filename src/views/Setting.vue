<template>
    <div v-if="encounter">
        <h1>
            <small class="text-muted">{{encounter.Type}}</small>
            {{encounter.Name}}
            <button class="btn btn-lg" @click="refresh" v-if="isEnabled"
                ><i :class="`fa fa-refresh ${fontColor}`" aria-hidden="true"></i>
            </button>
        </h1>
        <div v-if="isGM">
            <div class="input-group my-2">
                <span class="input-group-text">Set Environments</span>
                <select class="form-select" multiple v-model="encounter.Environment">
                    <option v-for="(environment, index) in environments" :key="index" :value="environment">
                        {{environment}}
                    </option>
                </select>
                <button class="btn btn-secondary" @click="setEnvironment">Set</button>
            </div>
            <div class="input-group my-2">
                <span class="input-group-text">Add Wild Pokemon</span>
                <input class="form-control" list="datalistOptions" id="pokemonDataList" v-model="wildPokemon" placeholder="Type to search...">
                <datalist id="datalistOptions" name="pokemon">
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon.name+'_'+pokemon.form" :value="pokemon.friendly">
                        {{index}}
                    </option>
                </datalist>
                <span class="input-group-text">x-coordinate</span>
                <input type="number" min="0" :max="length" v-model="x">
                <span class="input-group-text">y-coordinate</span>
                <input type="number" min="0" :max="length" v-model="y">
                <input class="form-check-input" type="checkbox" title="Force Shiny" v-model="forceShiny">
                <button class="btn btn-secondary" @click="addWild">Add</button>
            </div>
            <div class="input-group my-2">
                <span class="input-group-text">Add Npc</span>
                <select v-model="npcSelection" class="form-select">
                    <option value=""></option>
                    <option v-for="(npc, index) in npcs" :key="index" :value="index">
                        {{npc.trainerName}}
                    </option>
                </select>
                <span class="input-group-text">x-coordinate</span>
                <input type="number" min="0" :max="length" v-model="x">
                <span class="input-group-text">y-coordinate</span>
                <input type="number" min="0" :max="length" v-model="y">
                <button class="btn btn-secondary" @click="addNpc">Add</button>
            </div>
            <div class="input-group my-2" v-if="participantId && displaySection == 'Npc'">
                <span class="input-group-text">Add Npc Mon</span>
                <select v-model="npcMonSelection" class="form-select">
                    <option value=""></option>
                    <option v-for="(pokemon, index) in selectedNpc.pokemonTeam" :key="index" :value="pokemon">
                        {{pokemon.nickname}}
                    </option>
                </select>
                <span class="input-group-text">x-coordinate</span>
                <input type="number" min="0" :max="length" v-model="x">
                <span class="input-group-text">y-coordinate</span>
                <input type="number" min="0" :max="length" v-model="y">
                <button class="btn btn-secondary" @click="addNpcMon">Add</button>
            </div>
            <div class="input-group my-2">
                <span class="input-group-text">Remove from encounter</span>
                <select v-model="removalOption" class="form-select">
                    <option value=""></option>
                    <option
                        v-for="activeParticipant in activeParticipants"
                        :key="activeParticipant.ParticipantId"
                        :value="activeParticipant.ParticipantId">
                        ({{activeParticipant.Type}}) {{activeParticipant.Name}}
                    </option>
                </select>
                <button class="btn btn-danger" @click="removeFromEncounter">Remove</button>
            </div>
            <section v-if="displaySection">
                <trainer-sheet :trainerId="participantId" v-if="displaySection == 'Trainer'" />
                <pokemon-sheet :pokemonId="participantId" v-if="displaySection == 'Pokemon'" />
                <npc-sheet :npcId="participantId" v-if="displaySection == 'Npc'" />
            </section>
        </div>
        <div v-if="encounter.Environment.length > 0">
            ({{encounter.Environment.join('/')}})
        </div>
        <div v-if="isGM">
            <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
                <button
                    :class="'col border border-dark btn grid-cell ' + cellData.color"
                    v-for="(cellData, columnIndex) in row"
                    :key="`${rowIndex}_${columnIndex}`"
                    :id="`cell_${rowIndex}_${columnIndex}`"
                    @contextmenu.prevent="togglePath(rowIndex,columnIndex,cellData.participant.ParticipantId)">
                    <img class="img-fluid"
                        :src="cellData.url"
                        :alt="cellData.alt"
                        @click="changeDisplay(cellData)"
                        v-if="cellData.url && cellData.url.length > 0"
                        :title="cellData.alt">
                    <div
                        class=" grid-cell"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-else>
                    </div>
                    <cell-modal
                        :participant="cellData.participant"
                        :x="rowIndex"
                        :y="columnIndex"
                        :modalSize="cellData.modalSize"
                        :trainerMons="trainerMons"
                        :participants="activeParticipants"
                        :socket="socket" />
                </button>
            </div>
        </div>
        <div v-else>
            <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
                <button
                    :class="'col border border-dark btn grid-cell ' + cellData.color"
                    v-for="(cellData, columnIndex) in row"
                    :key="`${rowIndex}_${columnIndex}`"
                    :id="`cell_${rowIndex}_${columnIndex}`"
                    @contextmenu.prevent="togglePath(rowIndex,columnIndex,cellData.participant.ParticipantId)">
                    <img class="img-fluid"
                        :src="cellData.url"
                        :alt="cellData.alt"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-if="cellData.url && cellData.url.length > 0"
                        :title="cellData.alt">
                    <div
                        class=" grid-cell"
                        data-bs-toggle="modal"
                        :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                        v-else>
                    </div>
                    <cell-modal
                        :participant="cellData.participant"
                        :x="rowIndex"
                        :y="columnIndex"
                        :modalSize="cellData.modalSize"
                        :trainerMons="trainerMons"
                        :participants="activeParticipants"
                        :socket="socket" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { getGameId, getIsGM, getTrainer, setCellParticipant, setPTAActivityToken, } from '../utils/localStorage'
import { addToActiveEncounter, getActiveEncounterWebSocket, getEnvironments, removeFromActiveEncounter, setEnvironment } from '../api/setting.api'
import { generateErrorModal } from '../utils/modalUtil'
import CellModal from '../components/modals/CellModal.vue'
import { deletePokemon, getGamePokemon } from '../api/pokemon.api'
import { createWildPokemon, findTrainerInGame } from '../api/game.api'
import TrainerSheet from '../components/encounter/TrainerSheet.vue'
import PokemonSheet from '../components/encounter/PokemonSheet.vue'
import NpcSheet from '../components/encounter/NpcSheet.vue'
import { getNpc, getNpcsInGame } from '../api/npc.api'
import { getAllBasePokemon } from '../api/dex.api'
export default {
    name: "Encounter",
    components: {
        CellModal,
        TrainerSheet,
        PokemonSheet,
        NpcSheet
    },
    data() {
        return {
            isGM: getIsGM(),
            length: 15,
            encounterMap: [
                [
                    {
                        color: null,
                        url: '',
                        participant: {},
                        modalSize: '',
                        alt: ''
                    }
                ]
            ],
            pokemonToAdd: "",
            trainerMons: [],
            gameId: getGameId(),
            encounter: null,
            x: 0,
            y: 0,
            displaySection: null,
            participantId: '',
            pokemonCol: {},
            activeParticipants: [],
            forceShiny: false,
            wildPokemon: '',
            removalOption: '',
            npcs: [],
            npcSelection: null,
            npcMonSelection: null,
            selectedNpc: {},
            fontColor: '',
            isEnabled: true,
            socket: getActiveEncounterWebSocket(),
            environments: [],
            trainerId: null,
            path: [],
            diagonalMovement: Math.sqrt(2)
        }
    },
    async beforeMount(){
        if (this.gameId){
            if (!this.isGM){
                const trainer = getTrainer();
                this.trainerMons = trainer.pokemonTeam
                this.trainerId = trainer.trainerId
            }
            else {
                await getNpcsInGame(this.gameId).then(response => {
                    this.npcs = response.data;
                });
                await getAllBasePokemon()
                    .then(response => {
                        for (const item of response.data){
                            let friendly = item.name;
                            if (item.form != "Base"){
                                friendly = `${item.form.replace("Base/", "")} ${item.name}`
                            }
                            this.pokemonCol[friendly] = item;
                        }
                    })
                    .catch(generateErrorModal);
                await getEnvironments()
                    .then(response => {
                        this.environments = response.data
                    })
            }

            this.socket.onmessage = (event) => {
                this.encounter = JSON.parse(event.data);
                this.updateMap();
            }

            this.socket.onerror = event => {
                console.log(event);
            }
            
            switch (this.socket.readyState){
                case 0:
                    setTimeout(() => this.socket.send(""), 5000);
                    break;
                case 1:
                    this.socket.send("");
                    break;
                default:
                    generateErrorModal({
                        status: 'Failed to connect to websocket',
                        error: this.socket.readyState
                    });
                    break;
            }
        }
    },
    unmounted(){
        this.socket.close()
    },
    methods: {
        refresh(){
            this.socket.send("");
        },
        async updateMap(){
            this.initializeMap()
            if (!this.encounter){
                return;
            }
            this.activeParticipants = this.encounter.ActiveParticipants;
            for (const participant of this.encounter.ActiveParticipants) {
                if (this.encounterMap[participant.Position.X][participant.Position.Y].participant.ParticipantId != participant.ParticipantId){
                    this.removeClones(participant.ParticipantId);
                    const source = await this.setACellParticipant(participant);
                    this.encounterMap[participant.Position.X][participant.Position.Y].participant = participant;
                    this.encounterMap[participant.Position.X][participant.Position.Y].alt = participant.Name;
                    this.encounterMap[participant.Position.X][participant.Position.Y].modalSize = 'modal-fullscreen'
                    switch (participant.Type){
                        case "Trainer":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = `http://play.pokemonshowdown.com/sprites/trainers/${source.sprite}.png`
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-dark"
                            break;
                        case "Pokemon":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = this.getPokemonGif(source.isShiny, source.normalPortrait, source.shinyPortrait);
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-success"
                            break;
                        case "WildPokemon":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = this.getPokemonGif(source.isShiny, source.normalPortrait, source.shinyPortrait);
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-primary"
                            break;
                        case "EnemyNpc":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = `http://play.pokemonshowdown.com/sprites/trainers/${source.sprite}.png`
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-danger"
                            break;
                        case "EnemyPokemon":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = this.getPokemonGif(source.isShiny, source.normalPortrait, source.shinyPortrait);
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-danger"
                            break;
                        case "NeutralNpc":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = `http://play.pokemonshowdown.com/sprites/trainers/${source.sprite}.png`
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-secondary"
                            break;
                        case "NeutralPokemon":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = this.getPokemonGif(source.isShiny, source.normalPortrait, source.shinyPortrait);
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-secondary"
                            break;
                    }
                }
            }
            setTimeout(() => {
                this.fontColor = ''
                this.isEnabled = true
            }, 5000);
            this.fontColor = 'text-muted'
            this.isEnabled = false
        },
        getPokemonGif(isShiny, normalPortrait, shinyPortrait){
            if (isShiny){
                return `https://play.pokemonshowdown.com/sprites/ani-shiny/${shinyPortrait}.gif`;
            }

            return `https://play.pokemonshowdown.com/sprites/ani/${normalPortrait}.gif`
        },
        removeClones(participantId){
            for (const row of this.encounterMap){
                for (const cell of row){
                    const participant = cell.participant
                    if (participant.ParticipantId == participantId){
                        this.encounterMap[participant.Position.X][participant.Position.Y] = {
                            color: null,
                            participant: {}
                        }
                    }
                }
            }
        },
        togglePath(x, y, id){
            if (this.path.length){
                for (const cell of this.path){
                    document.getElementById(`cell_${cell}`).classList.remove("btn-info")
                }
                this.path = []
                return;
            }
            if (!(this.isGM || this.trainerId == id || this.trainerMons.some(pokemon => pokemon.pokemonId == id))){
                return;
            }

            const speed = this.encounterMap[x][y].participant.Speed;
            this.path = [...new Set(this.getPath(x, y, speed))]
            for (const cell of this.path){
                document.getElementById(`cell_${cell}`).classList.add("btn-info")
            }
        },
        getPath(x, y, speed){
            let path = []
            if (speed < 1 || x < 0 || y < 0 || x > this.length || y > this.length){
                return path
            }
            const diagonalSpeed = speed - this.diagonalMovement
            speed--;
            if (x < this.length && !this.encounterMap[x+1][y].participant.ParticipantId){
                path.push(`${x+1}_${y}`)
                path = path.concat(this.getPath(x+1, y, speed))
            }
            if (x > 0 && !this.encounterMap[x-1][y].participant.ParticipantId){
                path.push(`${x-1}_${y}`)
                path = path.concat(this.getPath(x-1, y, speed))
            }
            if (y < this.length && !this.encounterMap[x][y+1].participant.ParticipantId){
                path.push(`${x}_${y+1}`)
                path = path.concat(this.getPath(x, y+1, speed))
            }
            if (y > 0 && !this.encounterMap[x][y-1].participant.ParticipantId){
                path.push(`${x}_${y-1}`)
                path = path.concat(this.getPath(x, y-1, speed))
            }
            if (diagonalSpeed >= this.diagonalMovement){
                if (x < this.length && y < this.length && !this.encounterMap[x+1][y+1].participant.ParticipantId){
                    path.push(`${x+1}_${y+1}`)
                    path = path.concat(this.getPath(x+1, y+1, diagonalSpeed))
                }
                if (x < this.length && y > 0 && !this.encounterMap[x+1][y-1].participant.ParticipantId){
                    path.push(`${x+1}_${y-1}`)
                    path = path.concat(this.getPath(x+1, y-1, diagonalSpeed))
                }
                if (x > 0 && y < this.length && !this.encounterMap[x-1][y+1].participant.ParticipantId){
                    path.push(`${x-1}_${y+1}`)
                    path = path.concat(this.getPath(x+1, y+1, diagonalSpeed))
                }
                if (x > 0 && y > 0 && !this.encounterMap[x+1][y-1].participant.ParticipantId){
                    path.push(`${x-1}_${y-1}`)
                    path = path.concat(this.getPath(x+1, y-1, diagonalSpeed))
                }
            }

            return path;
        },
        async setEnvironment(){
            if (this.encounter.Environment.length > 0){
                await setEnvironment(this.encounter.Environment.join(','))
                    .catch(generateErrorModal);
            }
        },
        async addNpc(){
            if (this.x > this.length || this.x < 0){
                return;
            }
            if (this.y > this.length || this.y < 0){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }
            if (!this.npcs[this.npcSelection]){
                return;
            }
            
            var npc = this.npcs[this.npcSelection];
            await addToActiveEncounter({
                participantId: npc.npcId,
                name: npc.trainerName,
                health: "Feeling fresh!",
                type: "EnemyNpc",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: npc.trainerStats.speed
            })
            .catch(generateErrorModal)
        },
        async addNpcMon(){
            if (this.x > this.length || this.x < 0){
                return;
            }
            if (this.y > this.length || this.y < 0){
                return;
            }
            if (this.encounterMap[this.x][this.y].participant.id){
                return;
            }
            if (!this.npcMonSelection){
                return;
            }
                        
            await addToActiveEncounter({
                participantId: this.npcMonSelection.pokemonId,
                name: this.npcMonSelection.nickname,
                health: "Feeling fresh!",
                type: "EnemyPokemon",
                position: {
                    x: this.x,
                    y: this.y
                },
                speed: this.npcMonSelection.pokemonStats.speed
            })
            .catch(generateErrorModal)
        },
        async setACellParticipant(participant){
            switch (participant.Type){
                case "Trainer":
                    return await findTrainerInGame(getGameId(), participant.ParticipantId)
                        .then(response => {
                            setCellParticipant(participant.ParticipantId, response.data.trainer)
                            return response.data.trainer;
                        })
                        .catch(console.log);
                case "Pokemon":
                case "WildPokemon":
                case "EnemyPokemon":
                case "NeutralPokemon":
                    return await getGamePokemon(participant.ParticipantId)
                        .then(response => {
                            setCellParticipant(participant.ParticipantId, response.data)
                            return response.data;
                        })
                        .catch(console.log);
                case "EnemyNpc":
                case "NeutralNpc":
                    return await getNpc(participant.ParticipantId)
                        .then(response => {
                            setCellParticipant(participant.ParticipantId, response.data)
                            return response.data;
                        })
                        .catch(console.log);
            }
        },
        async removeFromEncounter(){
            if (this.removalOption){
                await removeFromActiveEncounter(this.removalOption)
                    .catch(generateErrorModal)
            }
        },
        async addWild(){
            const pokemon = this.pokemonCol[this.wildPokemon];
            await createWildPokemon(pokemon.name, '', '', '', pokemon.form, this.nickname, this.forceShiny)
                .then(async (response)=> {
                    const pokemonModel = response.data;
                    await addToActiveEncounter({
                        participantId: pokemonModel.pokemonId,
                        name: pokemonModel.nickname,
                        health: "Feeling fresh!",
                        type: "WildPokemon",
                        position: {
                            x: this.x,
                            y: this.y
                        },
                        speed: pokemonModel.pokemonStats.speed
                    })
                    .catch(async () => {
                        await deletePokemon(pokemonModel.pokemonId)
                            .then(response => {
                                setPTAActivityToken(response.headers['pta-activity-token']);
                            })
                        generateErrorModal({
                            status: `There is already a unit at (${this.x},${this.y})`,
                            reason: `Deleting ${pokemonModel.nickname}`
                        })
                    })
                })
                .catch(generateErrorModal);
        },
        changeDisplay(cellData){
            if (cellData.participant.ParticipantId == this.participantId){
                if (this.displaySection){
                    this.displaySection = null
                }
                else {
                    this.displaySection = cellData.participant.type
                }
            }
            else {
                this.displaySection = cellData.participant.type
                this.participantId = cellData.participant.ParticipantId

                if (this.displaySection == 'Npc'){
                    this.selectedNpc = this.npcs.find(npc => npc.npcId == this.participantId);
                    console.log(this.selectedNpc);
                }
            }
        },
        initializeMap(){
            for (let i = 0; i <= this.length; i++){
                this.encounterMap[i] = [];
                for (let j = 0; j <= this.length; j++){
                    this.encounterMap[i][j] = {
                        color: null,
                        participant: {}
                    }
                }
            }
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
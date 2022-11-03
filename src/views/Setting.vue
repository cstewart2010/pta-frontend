<template>
    <div v-if="encounter">
        <h1>
            <small class="text-muted">{{encounter.Type}}</small>
            {{encounter.Name}}
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#updateSettingModal" title="Update the Environment" v-if="isGM">
                <i class="fa-solid fa-plus"></i>
            </button>
            <button class="btn btn-lg" @click="refresh" v-if="isEnabled">
                <i :class="`fa fa-refresh ${fontColor}`" aria-hidden="true"></i>
            </button>
        </h1>
        <update-setting :socket="socket" :npcs="npcs" :encounterMap="encounterMap" :shops="shops" :activeParticipants="activeParticipants" v-if="isGM" />
        <div v-if="encounter.Environment.length > 0">
            {{encounter.Name}}'s Environment: {{encounter.Environment.join('/')}}
        </div>
        <div class="row" v-for="(row, rowIndex) in encounterMap" :key="rowIndex">
            <button
                :class="'col border border-dark btn grid-cell ' + cellData.color"
                v-for="(cellData, columnIndex) in row"
                :key="`${rowIndex}_${columnIndex}`"
                :id="`cell_${rowIndex}_${columnIndex}`"
                data-bs-toggle="modal"
                :data-bs-target="`#cellModal_${rowIndex}_${columnIndex}`"
                @contextmenu.prevent="togglePath(rowIndex,columnIndex,cellData.participant.ParticipantId)">
                <img class="img-fluid"
                    :src="cellData.url"
                    :alt="cellData.alt"
                    v-if="cellData.url && cellData.url.length > 0"
                    :title="cellData.alt">
                <div
                    v-else>
                </div>
            </button>
            <cell-modal
                v-for="(cellData, columnIndex) in row"
                :key="`${rowIndex}_${columnIndex}`"
                :participant="cellData.participant"
                :x="rowIndex"
                :y="columnIndex"
                :modalSize="cellData.modalSize"
                :trainerMons="trainerMons"
                :participants="activeParticipants"
                :socket="socket" />
        </div>
    </div>
</template>

<script>
import CellModal from '../components/modals/CellModal.vue'
import UpdateSetting from '../components/modals/UpdateSettingModal.vue'
import { getGameId, getIsGM, getTrainer, setCellParticipant, } from '../utils/localStorage'
import { getActiveEncounterWebSocket } from '../api/setting.api'
import { generateErrorModal } from '../utils/modalUtil'
import { getGamePokemon } from '../api/pokemon.api'
import { findTrainerInGame } from '../api/game.api'
import { getNpc, getNpcsInGame } from '../api/npc.api'
import { getShops, getShopTrainer } from '../api/shop.api'
export default {
    name: "Encounter",
    components: {
        CellModal,
        UpdateSetting
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
            trainerMons: [],
            gameId: getGameId(),
            encounter: null,
            x: 0,
            y: 0,
            participantId: '',
            activeParticipants: [],
            npcs: [],
            fontColor: '',
            isEnabled: true,
            socket: getActiveEncounterWebSocket(),
            trainerId: null,
            path: [],
            diagonalMovement: Math.sqrt(2),
            shops: []
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
                await getShops()
                    .then(response => {
                        this.shops = response.data.filter(shop => shop.isActive).map(shop => {
                            return {
                                name: shop.name,
                                shopId: shop.shopId
                            }
                        })
                    });
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
                        case "Shop":
                            this.encounterMap[participant.Position.X][participant.Position.Y].url = 'https://www.freeiconspng.com/thumbs/pokeball-png/pokeball-pokemon-ball-red-clipart-13.png'
                            this.encounterMap[participant.Position.X][participant.Position.Y].color = "bg-secondary"
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
            }
            if (!(this.isGM || this.trainerId == id || this.trainerMons.some(pokemon => pokemon.pokemonId == id))){
                return;
            }

            const speed = this.encounterMap[x][y].participant.Speed;
            this.path = [...new Set(this.getPath(x, y, speed, true))]
            for (const cell of this.path){
                document.getElementById(`cell_${cell}`).classList.add("btn-info")
            }
        },
        getPath(x, y, speed, self=false){
            let path = []
            if (self && !this.encounterMap[x][y].participant.ParticipantId){
                return path;
            }
            if (speed > 8){
                for (let i = 0; i <= this.length; i++){
                    for (let j = 0; j <= this.length; j++){
                        if (this.encounterMap[i][j].participant.ParticipantId){
                            continue;
                        }
                        const distance = Math.sqrt(Math.pow(x - i, 2) + Math.pow(y - j, 2));
                        if (distance <= speed){
                            path.push(`${i}_${j}`)
                        }
                    }
                }
                return path;
            }
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
                    path = path.concat(this.getPath(x-1, y+1, diagonalSpeed))
                }
                if (x > 0 && y > 0 && !this.encounterMap[x-1][y-1].participant.ParticipantId){
                    path.push(`${x-1}_${y-1}`)
                    path = path.concat(this.getPath(x-1, y-1, diagonalSpeed))
                }
            }

            return path;
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
                case "Shop":
                    return await getShopTrainer(participant.ParticipantId)
                        .then(response => {
                            setCellParticipant(participant.ParticipantId, response.data.inventory)
                            return null
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
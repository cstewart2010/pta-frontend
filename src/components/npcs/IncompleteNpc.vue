<template>
    <npc-doc v-if="isReady">
        <div v-if="sheet=='main'">
            <npc-sheet :npcId="npcId"/>
        </div>
        <div v-else-if="sheet=='features'">
            <class-features :npcId="npcId"/>
        </div>
        <div v-else-if="sheet=='moves'">
            <trainer-moves :npcId="npcId"/>
        </div>
        <div v-else-if="sheet=='team'">
           <pokemon-team :npcId="npcId"/>
        </div> 
    </npc-doc>
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">Save Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to save your changes?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" data-bs-target="#confirmationModal" data-bs-dismiss="modal" @click="saveChange">Save Changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('main')">Trainer Sheet</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('features')">Class Features</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('moves')">Trainer Moves</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-dark" @click="switchSheet('team')">Pokemon Team</button>
                    </li>
                </ul>
                <div class="d-flex">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Save Changes</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { addNpcStats, createNpcPokemon } from '../../api/npc.api'
import NpcSheet from './NpcSheet.vue'
import ClassFeatures from './ClassFeatures.vue'
import TrainerMoves from './TrainerMoves.vue'
import PokemonTeam from './PokemonTeam.vue'
const ptaLocalStorage = require('../../utils/localStorage')

export default {
    name:"IncompleteNpc",
    components: {
        NpcSheet,
        ClassFeatures,
        TrainerMoves,
        PokemonTeam
    }, 
    data(){
        return {
            sheet: 'main',
            isReady: false
        }
    },
    props: {
        npcId: {
            default: ''
        }
    },
    beforeMount(){
        this.sheet = localStorage.getItem('savedNpcSheet') || 'main'
        this.isReady = true;
    },
    methods: {
        switchSheet(sheet){
            this.sheet = sheet;
            localStorage.setItem('savedNpcSheet', sheet);
        },
        async saveChange(){
            this.isReady = false;
            const npc = ptaLocalStorage.getNpc(this.npcId);
            npc.currentHp = ptaLocalStorage.getNpcHP() || npc.currentHp;
            npc.pokemonTeam = [];
            await createNpcPokemon(this.npcId, ptaLocalStorage.getPokemonNewTeam());
            await addNpcStats(this.npcId)
                .then(() => this.isReady = true)
        }
    }
}
</script>
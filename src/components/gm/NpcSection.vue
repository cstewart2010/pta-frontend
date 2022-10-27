<template>
    <div class="my-3" id="npcs">
        <div class="d-flex justify-content-between">
            <h3 class="text-dark">Npcs</h3>
            <div class="row" id="buttons">
                <div class="col">
                    <button class="btn btn-lg pe-2" @click="refresh" title="Refresh npc list" v-if="isEnabled && npcs.length">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="col">
                    <button class="btn btn-outline-dark rounded-circle" data-bs-toggle="modal" data-bs-target="#createNpcModal" title="Add a new npc">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="col">
                    <div class="form-check form-switch mt-2">
                        <input type="checkbox" class="form-check-input" v-model="toggle" title="Toggle section visibility">
                    </div>
                </div>
            </div>
        </div>
        <div v-show="toggle && npcs.length">
            <div class="row" v-for="npc in npcs" :key="npc.npcId">
                <button class="btn btn-secondary m-1 col-12 col-md" @click="updateNpcId(npc.npcId)">
                    {{npc.trainerName}}
                </button>
                <button class="btn btn-danger m-1 col-12 col-md" data-bs-toggle="modal" :data-bs-target="'#npcConfirmationModal'+npc.npcId">
                    Delete {{npc.trainerName}}
                </button>
                <delete-npc :trainerName="npc.trainerName" :npcId="npc.npcId"/>
            </div>
            <section class="m-2" v-if="npcId">
                <incomplete-npc :npcId="npcId" />
            </section>
        </div>
        <div v-if="!npcs.length">
            Here is where your npcs will populate
        </div>
        <create-npc />
    </div>
</template>

<script>
import { getNpcsInGame } from '../../api/npc.api';
import CreateNpc from '../modals/CreateNpcModal.vue';
import DeleteNpc from '../modals/DeleteNpc.vue';
import IncompleteNpc from '../npcs/IncompleteNpc.vue'
export default {
    name: 'NpcSection',
    data(){
        return {
            npcId: '',
            npcs: [],
            isEnabled: true,
            toggle: true
        }
    },
    components: {
        IncompleteNpc,
        DeleteNpc,
        CreateNpc
    },
    async beforeMount(){
        await this.refresh()
            .catch(console.log);
    },
    methods: {
        async refresh(){
            await getNpcsInGame()
                .then(response => {
                    this.npcs = response.data;
                    this.isEnabled = false;
                    setTimeout(() => this.isEnabled = true, 5000)
                });
        },
         updateNpcId(npcId){
            if (this.npcId == npcId){
                this.npcId = '';
            }
            else {
                this.npcId = npcId;
            }
        }
    }
}
</script>
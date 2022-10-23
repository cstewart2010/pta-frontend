<template>
    <div class="my-3" id="npcs">
        <div class="d-flex align-items-center">
            <h3 class="text-dark">Npcs</h3>
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#createNpcModal" title="Add a new npc">
                <i class="fa-solid fa-plus text-dark"></i>
            </button>
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" v-model="toggle" title="Toggle section visibility">
            </div>
            <button class="btn btn-lg" @click="refresh" title="Refresh npc list" v-if="isEnabled">
                <i :class="'fa fa-refresh'" aria-hidden="true"></i>
            </button>
        </div>
        <div v-show="toggle">
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
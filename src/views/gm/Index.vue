<template>
    <div class="row">
        <div class="col-9 border-end">
            <section class="m-2" v-if="trainerId!=null">
                <incomplete-trainer :trainerId="trainerId" />
            </section>
            <div class="my-3" id="trainers">
                <h3>Trainers</h3>
                <div class="row">
                    <div class="my-1" v-for="trainer in regularTrainers" :key="trainer.trainerId">
                        <button class="btn btn-secondary col-6" @click="updateTrainerId(trainer.trainerId)">
                            {{trainer.trainerName}}
                        </button>
                        <button class="btn btn-danger col-6" data-bs-toggle="modal" :data-bs-target="'#trainerConfirmationModal'+trainer.trainerId">
                            Delete {{trainer.trainerName}}
                        </button>
                        <delete-trainer :trainerId="trainer.trainerId" :trainerName="trainer.trainerName" />
                    </div>
                </div>
                <div class="row" v-if="regularTrainers.length > 0">
                    <div class="input-group my-1">
                        <span class="input-group-text">Add a group honor</span>
                        <textarea class="form-control" v-model="groupHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onGroupHonor">Add honor</button>
                    </div>
                </div>
                <div class="row" v-if="regularTrainers.length > 0">
                    <div class="input-group my-1">
                        <span class="input-group-text">Add a single honor</span>
                        <select class="form-select" v-model="singleRecipient">
                            <option value=""></option>
                            <option v-for="trainer in regularTrainers" :key="trainer.trainerId" :value="trainer.trainerId">
                                {{trainer.trainerName}}
                            </option>
                        </select>
                        <textarea class="form-control" v-model="singleHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onSingleHonor">Add honor</button>
                    </div>
                </div>
            </div>
             <section class="m-2" v-if="npcId!=null">
                <incomplete-npc :npcId="npcId" />
            </section>
            <div id="npcs" class="my-3">
                <h3 class="text-muted">NPCS</h3>
                <div class="row">
                    <div class="my-1" v-for="npc in npcs" :key="npc.npcId">
                        <button class="btn btn-secondary col-6" @click="updateNpcId(npc.npcId)">
                            {{npc.trainerName}}
                        </button>
                        <button class="btn btn-danger col-6" data-bs-toggle="modal" :data-bs-target="'#npcConfirmationModal'+npc.npcId">
                            Delete {{npc.trainerName}}
                        </button>
                        <delete-npc :trainerName="npc.trainerName" :npcId="npc.npcId"/>
                    </div>
                </div>
                <div class="input-group my-1">
                    <span class="input-group-text">Add a Npc</span>
                    <input class="form-control" v-model="npcName">
                    <select class="form-select" v-model="npcClasses" multiple>
                        <option v-for="trainerClass in allClasses" :key="trainerClass" :value="trainerClass">
                            {{trainerClass}}
                        </option>
                    </select>
                    <select class="form-select" v-model="npcFeats" multiple>
                        <option v-for="feat in allFeats" :key="feat" :value="feat">
                            {{feat}}
                        </option>
                    </select>
                    <button class="btn btn-secondary" @click="onCreateNewNpc">Add Npc</button>
                </div>
            </div>
            <div id="encounters" class="my-3">
                <h3 class="text-primary">Encounters</h3>
                <div class="row">
                    <div class="my-1" v-for="encounter in encounters" :key="encounter.encounterId">
                        <button class="btn btn-primary col-6" @click="deactivateEncounter(encounter.encounterId)" v-if="encounter.isActive">
                            Deactive {{encounter.name}}
                        </button>
                        <button class="btn btn-secondary col-6" @click="activateEncounter(encounter.encounterId)" v-else>
                            Activate {{encounter.name}}
                        </button>
                        <button class="btn btn-danger col-6" data-bs-toggle="modal" :data-bs-target="'#encounterConfirmationModal'+encounter.encounterId">
                            Delete {{encounter.name}}
                        </button>
                        <delete-encounter :encounterName="encounter.name" :encounterId="encounter.encounterId" />
                    </div>
                </div>
                <div class="input-group my-1">
                    <span class="input-group-text">Create a new encounter</span>
                    <input type="text" v-model="encounterName">
                    <select class="form-select" v-model="encounterType">
                        <option value="" selected></option>
                        <option value="Wild">Wild</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    <button class="btn btn-primary" @click="onNewEncounter">Add encounter</button>
                </div>
            </div>
            <div class="my-3" id="danger-zone">
                <h3 class="text-danger">Danger Zone</h3>
                <div class="row">
                    <div class="input-group my-1 col-2">
                        <span class="input-group-text">Session Password</span>
                        <input type="password" v-model="gameSessionPassword">
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <delete-game :gameSessionPassword="gameSessionPassword" />
                    </div>
                    <div class="col-2">
                        <export-game :gameSessionPassword="gameSessionPassword" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col m-2">
            <journal />
        </div>
    </div>
</template>

<script>
import { addGroupHonor, addHonor } from '../../api/trainer.api';
import { getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM, removeTrainer } from '../../utils/localStorage';
import { generateErrorModal, generateNavigationModal } from '../../utils/modalUtil';
import { refreshInGame } from '../../api/user.api'
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue'
import DeleteGame from '../../components/modals/DeleteGame.vue'
import DeleteTrainer from '../../components/modals/DeleteTrainer.vue'
import DeleteEncounter from '../../components/modals/DeleteEncounter.vue'
import ExportGame from '../../components/modals/ExportGame.vue'
import Journal from '../Journal.vue'
import { createNewNpc, getNpcsInGame } from '../../api/npc.api';
import { getAllGeneralFeatures, getAllTrainerClasses} from '../../api/dex.api';
import { createEncounter, getAllEncounters, setEncounterToActive, setEncounterToInactive } from '../../api/encounter.api';
import DeleteNpc from '../../components/modals/DeleteNpc.vue';
import IncompleteNpc from '../../components/npcs/IncompleteNpc.vue';
export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            gameSessionPassword: '',
            trainerId: null,
            groupHonor: '',
            singleHonor: '',
            singleRecipient: '',
            regularTrainers: [],
            npcName: '',
            npcId: null,
            npcClasses: [],
            npcFeats: [],
            npcs: [],
            allClasses: [],
            allFeats:[],
            encounterName: '',
            encounterType: '',
            encounters: []
        }
    },
    components: {
        DeleteGame,
        DeleteTrainer,
        DeleteEncounter,
        ExportGame,
        IncompleteTrainer,
        Journal,
        IncompleteNpc,
        DeleteNpc
    },
    beforeMount: async function(){
        await refreshInGame()
        .then(async response => {
            var wasNotGM = !getIsGM();
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (wasNotGM){
                setIsGM(true);
                location.reload();
            }
            this.trainers = getTrainers();
            this.regularTrainers = this.trainers.filter(trainer => !trainer.isGM)
            await getNpcsInGame()
            .then(response => {
                this.npcs = response.data;
            });
            await getAllEncounters()
                .then(response => {
                    this.encounters = response.data;
                });
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })

        await getAllTrainerClasses()
        .then(response => {
            this.allClasses = response.data.results.map(item => item.name)
        })

        await getAllGeneralFeatures()
        .then(response => {
            this.allFeats = response.data.results.map(item => item.name)
        })
    },
    methods: {
        updateTrainerId(trainerId){
            if (this.trainerId == trainerId){
                this.trainerId = null;
                removeTrainer()
            }
            else {
                this.npcId = null;
                this.trainerId = trainerId;
            }
        },
         updateNpcId(npcId){
            if (this.npcId == npcId){
                this.npcId = null;
            }
            else {
                this.npcId = npcId;
                this.trainerId = null;
            }
        },
        async onGroupHonor(){
            if (this.groupHonor.length == 0){
                return;
            }
            await addGroupHonor(this.groupHonor)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
                .catch(generateErrorModal);
        },
        async onSingleHonor(){
            if (this.singleHonor.length == 0){
                return;
            }
            if (this.singleRecipient.length == 0){
                return;
            }
            await addHonor(this.singleHonor, this.singleRecipient)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })
                .catch(generateErrorModal);
        },
        async onCreateNewNpc(){
              if (this.npcName.length == 0){
                return;
            }
            await createNewNpc(this.npcName, this.npcClasses, this.npcFeats)
             .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    location.reload();
                })},
        async onNewEncounter(){
            if (this.encounterName.length == 0){
                return;
            }
            if (this.encounterType.length == 0){
                return;
            }

            await createEncounter(this.encounterName, this.encounterType)
                .then(() => location.reload())
                .catch(generateErrorModal);
        },
        async activateEncounter(encounterId){
            await setEncounterToActive(encounterId)
                .then(() => location.reload())
                .catch(generateErrorModal);
        },
        async deactivateEncounter(encounterId){
            await setEncounterToInactive(encounterId)
                .then(() => location.reload())
                .catch(generateErrorModal);
        }
    }
}
</script>

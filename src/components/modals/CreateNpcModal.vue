<template>
    <div class="modal fade" id="createNpcModal" tabindex="-1" aria-labelledby="createNpcModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createNpcModalLabel">Create Npc</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearData"></button>
                </div>
                <div class="modal-body">
                    <form :id="formId" class="row needs-validation" @submit.prevent="onCreateNewNpc" novalidate>
                        <div class="col-12">
                            <input type="text" class="form-control" v-model="npcName" placeholder="Npc name" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
                            <validation-feedback name="Npc name" />
                        </div>
                        <div class="col-12 my-2">
                            <label class="form-label" for="trainer-classes"> Trainer Classes</label>
                            <select id="trainer-classes" class="form-select" v-model="npcClasses" multiple required>
                                <option v-for="(trainerClass, index) in allClasses" :key="index" :value="trainerClass">
                                    {{trainerClass}}
                                </option>
                            </select>
                            <validation-feedback name="Trainer classes" :useInvalid="false" />
                        </div>
                        <div class="col-12 my-2">
                            <select id="" class="form-select" v-model="npcFeats" multiple required>
                                <option v-for="(feats, index) in allFeats" :key="index" :value="feats">
                                    {{feats}}
                                </option>
                            </select>
                            <validation-feedback name="Trainer feats" :useInvalid="false" />
                        </div>
                        <div class="col-12 mt-2">
                            <button type="submit" class="btn btn-primary">Add {{npcName}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAllGeneralFeatures, getAllTrainerClasses } from '../../api/dex.api';
import { createNewNpc } from '../../api/npc.api';
import { checkValidation, removeValidation } from '../../utils/credentials';
import { npcData } from '../../utils/initialStates';
import ValidationFeedback from '../partials/ValidationFeedback.vue'
export default {
    name: "CreateNpc",
    data(){
        return {
            ...npcData(),
            allClasses: [],
            allFeats: [],
            formId: 'create-npc'
        }
    },
    components: {
        ValidationFeedback
    },
    async beforeMount(){
        await getAllTrainerClasses()
        .then(response => {
            this.allClasses = response.data.results.map(item => item.name)
        });

        await getAllGeneralFeatures()
        .then(response => {
            this.allFeats = response.data.results.map(item => item.name)
        });
    },
    methods: {
        async onCreateNewNpc(){
            if (!checkValidation(this.formId)){
                return;
            }
            await createNewNpc(this.npcName, this.npcClasses, this.npcFeats)
                .then(() => {
                    this.clearData();
                })
                .catch(console.log);
        },
        clearData(){
            Object.assign(this.$data, npcData());
            removeValidation(this.formId);
        }
    }
}
</script>
<template>
    <div class="modal fade" id="createSettingModal" tabindex="-1" aria-labelledby="createSettingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createSettingModalLabel">Create Shop</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearData"></button>
                </div>
                <div class="modal-body">
                    <form :id="formId" class="row needs-validation" @submit.prevent="onNewSetting" novalidate>
                        <div class="col-6">
                            <input type="text" class="form-control" v-model="settingName" placeholder="Setting name" minlength="6" maxlength="18" pattern="^\w+( +\w+)*$" required>
                            <validation-feedback name="Setting name" />
                        </div>
                        <div class="col-6">
                            <select class="form-select" v-model="settingType" required>
                                <option value="" disabled selected></option>
                                <option value="Hostile">Hostile</option>
                                <option value="NonHostile">NonHostile</option>
                            </select>
                            <validation-feedback name="Setting type" :useInvalid="false" />
                        </div>
                        <div class="col-12 mt-2">
                            <button type="submit" class="btn btn-primary">Add setting</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createEncounter } from '../../api/setting.api';
import { checkValidation, removeValidation } from '../../utils/credentials';
import { settingData } from '../../utils/initialStates';
import ValidationFeedback from '../partials/ValidationFeedback.vue'
export default {
    name: "CreateSetting",
    data(){
        return {
            ...settingData(),
            formId: 'create-setting'
        }
    },
    components: {
        ValidationFeedback
    },
    methods: {
        async onNewSetting(){
            if (!checkValidation(this.formId)){
                return;
            }
            await createEncounter(this.settingName, this.settingType)
                .then(() => {
                    this.clearData();
                })
                .catch(console.log);
        },        
        clearData(){
            Object.assign(this.$data, settingData());
            removeValidation(this.formId);
        }
    }
}
</script>
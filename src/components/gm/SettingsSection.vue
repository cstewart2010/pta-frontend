<template>
    <div class="my-3" id="settings">
        <div class="d-flex justify-content-between">
            <h3 class="text-primary">Settings</h3>
            <div class="row" id="buttons">
                <div class="col">
                    <button class="btn btn-lg pe-2" @click="refresh" title="Refresh setting list" v-if="isEnabled">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="col">
                    <button class="btn btn-outline-primary rounded-circle" data-bs-toggle="modal" data-bs-target="#createSettingModal" title="Add a new setting">
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
        <div v-show="toggle && settings.length">
            <div class="row" v-for="(setting, index) in settings" :key="index">
                <button class="btn btn-primary m-1 col-12 col-md" @click="deactivateSetting(setting.settingId)" v-if="setting.isActive">
                    Deactive {{setting.name}}
                </button>
                <button class="btn btn-secondary m-1 col-12 col-md" @click="activateSetting(setting.settingId)" v-else>
                    Activate {{setting.name}}
                </button>
                <button class="btn btn-danger m-1 col-12 col-md" data-bs-toggle="modal" :data-bs-target="'#settingConfirmationModal'+setting.settingId">
                    Delete {{setting.name}}
                </button>
                <delete-encounter :settingName="setting.name" :settingId="setting.settingId" />
            </div>
        </div>
        <div v-if="!settings.length">
            Here is where your settings will populate
        </div>
        <create-setting />
    </div>
</template>

<script>
import { getAllEncounters, setEncounterToActive, setEncounterToInactive } from '../../api/setting.api';
import { generateErrorModal } from '../../utils/modalUtil';
import DeleteEncounter from '../modals/DeleteEncounter.vue'
import CreateSetting from '../modals/CreateSettingModal.vue'
export default {
    name: "SettingsSection",
    data(){
        return {
            settingName: '',
            settingType: '',
            settings: [],
            isEnabled: true,
            toggle: true
        }
    },
    components: {
        DeleteEncounter,
        CreateSetting,
    },
    async beforeMount(){
        await this.refresh()
            .catch(console.log);
    },
    methods: {
        async activateSetting(settingId){
            await setEncounterToActive(settingId)
                .then(async () => await this.refresh())
                .catch(generateErrorModal);
        },
        async deactivateSetting(settingId){
            await setEncounterToInactive(settingId)
                .then(async () => await this.refresh())
                .catch(generateErrorModal);
        },
        async refresh(){
            await getAllEncounters()
                .then(response => {
                    this.settings = response.data;
                    this.isEnabled = false;
                    setTimeout(() => this.isEnabled = true, 5000)
                });
        }
    }
}
</script>
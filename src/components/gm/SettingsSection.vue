<template>
    <div class="my-3" id="settings">
        <div class="d-flex align-items-center">
            <h3 class="text-primary">Settings</h3>
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#createSettingModal" title="Add a new setting">
                <i class="fa-solid fa-plus text-primary"></i>
            </button>
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" v-model="toggle">
            </div>
            <button class="btn btn-lg" @click="refresh" title="Refresh setting list" v-if="isEnabled">
                <i :class="'fa fa-refresh'" aria-hidden="true"></i>
            </button>
        </div>
        <div v-show="toggle">
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
            <create-setting />
        </div>
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
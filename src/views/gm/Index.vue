<template>
    <div v-if="readyToLoad">
        <trainer-section :regularTrainers="regularTrainers" />
        <npc-section />
        <shop-section />
        <settings-section />
        <danger-zone />
    </div>
    <spinner v-else />
</template>

<script>
import { getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';
import { refreshInGame } from '../../api/user.api'
import TrainerSection from '../../components/gm/TrainerSection.vue'
import NpcSection from '../../components/gm/NpcSection.vue'
import ShopSection from '../../components/gm/ShopSection.vue'
import SettingsSection from '../../components/gm/SettingsSection.vue'
import DangerZone from '../../components/gm/DangerZoneSection.vue'
import Spinner from '../../components/partials/Spinner.vue'
export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            regularTrainers: [],
            readyToLoad: false
        }
    },
    components: {
        TrainerSection,
        NpcSection,
        ShopSection,
        SettingsSection,
        DangerZone,
        Spinner
    },
    async beforeMount(){
        await refreshInGame()
        .then(async response => {
            var wasNotGM = !getIsGM();
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            this.readyToLoad = true
            if (wasNotGM){
                setIsGM(true);
                location.reload();
            }
            this.trainers = getTrainers();
            this.regularTrainers = this.trainers.filter(trainer => !trainer.isGM)
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
   }
}
</script>

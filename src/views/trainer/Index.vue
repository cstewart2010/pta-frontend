<template>
    <div class="pb-5 mb-5">
        <incomplete-trainer v-if="isReady" />
        <spinner v-else />
    </div>
</template>

<script>
import { refreshInGame } from '../../api/user.api'
import { getTrainer, removeFromStorage, setTrainer, setPTAActivityToken, setIsGM, setGameMasterId, setTrainerId } from '../../utils/localStorage';
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue';
import { generateNavigationModal } from '../../utils/modalUtil';
import Spinner from '../../components/partials/Spinner.vue'

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: getTrainer(),
            isComplete: false,
            isReady: false
        }
    },
    components: {
        IncompleteTrainer,
        Spinner
    },
    beforeMount:async function(){
        await refreshInGame()
        .then(response => {
            this.isComplete = response.data.trainer.isComplete
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (response.data.trainer.isGM){
                setGameMasterId(response.data.trainer.trainerId);
                setTrainerId(null);
                setIsGM(true);
                location.reload();
                return;
            }
            this.isReady = true
            setTrainer(response.data.trainer);
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    }
}
</script>
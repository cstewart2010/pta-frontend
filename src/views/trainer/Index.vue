<template>
    <div class="pb-5 mb-5">
        <div class="row">
            <div class="col-9 border-end">
                <incomplete-trainer />
            </div>
            <div class="col m-2">
                <journal />
            </div>
        </div>
    </div>
</template>

<script>
import { refreshInGame } from '../../api/user.api'
import { getTrainer, removeFromStorage, setTrainer, setPTAActivityToken, setIsGM, setGameMasterId, setTrainerId } from '../../utils/localStorage';
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue';
import { generateNavigationModal } from '../../utils/modalUtil';
import Journal from '../Journal.vue'

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: getTrainer(),
            isComplete: false
        }
    },
    components: {
        IncompleteTrainer,
        Journal
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
            setTrainer(response.data.trainer);
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    }
}
</script>
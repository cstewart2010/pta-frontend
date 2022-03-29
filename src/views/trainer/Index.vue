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
import { refreshTrainer } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainer, removeFromStorage, setTrainer, setPTAActivityToken, setIsGM, setGameMasterId, setTrainerId } from '../../utils/localStorage';
import IncompleteTrainer from '../../components/trainer/IncompleteTrainer.vue';
import { generateNavigationModal } from '../../utils/modalUtil';
import Journal from '../Journal.vue'

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: {},
            isComplete: false
        }
    },
    components: {
        IncompleteTrainer,
        Journal
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }

        await refreshTrainer()
        .then(response => {
            this.isComplete = response.data.trainer.isComplete
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (response.data.trainer.isGM){
                setGameMasterId(response.data.trainer.trainerId);
                setTrainerId(null);
                setIsGM(true);
                location.href = '/gm';
                return;
            }
            setTrainer(response.data.trainer);
            this.trainer = getTrainer();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    }
}
</script>
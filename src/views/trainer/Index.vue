<template>
    <div v-if="isComplete">
        {{trainer}}
    </div>
    <div v-else>
        <incomplete-trainer />
    </div>
</template>

<script>
import { refreshTrainer } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainer, removeFromStorage, setTrainer, setPTAActivityToken } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';
import IncompleteTrainer from '../../components/partials/IncompleteTrainer.vue';

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: null,
            isComplete: false
        }
    },
    components: {
        IncompleteTrainer
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
                this.$router.push('/gm');
                return;
            }
            setTrainer(response.data.trainer);
            this.trainer = getTrainer();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    },
}
</script>

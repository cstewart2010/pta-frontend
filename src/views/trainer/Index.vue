<template>
    <div class="pb-5 mb-5">
        {{refreshTrainer()}}
        <incomplete-trainer />
    </div>
</template>

<script>
import { refreshTrainer } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainer, removeFromStorage, setTrainer, setPTAActivityToken } from '../../utils/localStorage';
import IncompleteTrainer from '../../components/partials/IncompleteTrainer.vue';
import { generateNavigationModal } from '../../utils/modalUtil';

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: {},
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
    },
    methods: {
        async refreshTrainer(){
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
        }
    }
}
</script>
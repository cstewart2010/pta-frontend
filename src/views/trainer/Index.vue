<template>
    {{trainer}}
</template>

<script>
import { refreshTrainer } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainer, removeFromStorage, setTrainer, setPTAActivityToken } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';

export default {
    name: 'TrainerPortal',
    data(){
        return {
            trainer: null
        }
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        
        await refreshTrainer()
        .then(response => {
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

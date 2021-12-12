<template>    
    <div v-for="trainer in trainers" :key="trainer.TrainerId">
        {{trainer}}
    </div>
</template>

<script>
import { refreshGM } from '../../api/trainer.api';
import { getIsAuthenticate, getTrainers, setTrainers, removeFromStorage, setPTAActivityToken, setIsGM, getIsGM } from '../../utils/localStorage';
import { generateNavigationModal } from '../../utils/modalUtil';

export default {
    name: 'GMPortal',
    data(){
        return {
            trainers: [],
            ptaActivityToken: null,
            ptaSessionAuth: null,
        }
    },
    beforeMount:async function(){
        if (!getIsAuthenticate()){
            this.$router.push('/');
            return
        }
        // validate trainer credentials
        
        await refreshGM()
        .then(response => {
            var wasNotGM = !getIsGM();
            setIsGM(true);
            setTrainers(response.data.trainers)
            setPTAActivityToken(response.headers['pta-activity-token']);
            if (wasNotGM){
                this.$router.go();
            }
            this.trainers = getTrainers();
        })
        .catch(error => {
            removeFromStorage();
            generateNavigationModal(error.status, error.reason, '/');
        })
    },
}
</script>

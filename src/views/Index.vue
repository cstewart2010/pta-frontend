<template>
    <div v-if="!gameId">
        <h1>Landing</h1>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, beatae molestiae! Voluptatum adipisci reprehenderit laboriosam? Dignissimos consequatur beatae distinctio ab, officia quisquam pariatur placeat voluptatibus assumenda laboriosam ut, cumque accusamus.
        </p>
    </div>
    <game-master v-else-if="isGM" />
    <trainer v-else />
</template>

<script>
import { getGameId, getIsGM } from '../utils/localStorage'
import Trainer from './trainer/Index.vue';
import GameMaster from './gm/Index.vue'
export default {
    name: "Index",
    components: {
        Trainer,
        GameMaster
    },
    data() {
        return {
            gameId: '',
            isGM: false
        }
    },
    beforeMount(){
        this.gameId = getGameId();
        this.isGM = getIsGM();
    }
}
</script>
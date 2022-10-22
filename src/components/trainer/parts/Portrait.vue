<template>    
    <div class="col-md">
        <!-- Trainer level -->
        <div class="row">
            <div class="col-md-6">
                <div class="text-center">Honors</div>
                <div class="text-center">{{trainer.honors.length}}</div>
            </div>
            <div class="col-md-6">
                <div class="text-center">Level</div>
                <div class="text-center">{{trainer.level}}</div>
            </div>
        </div>
        <hr>
        <!-- Trainer image -->
        <div class="row">
            <img class="img-fluid" :src="`http://play.pokemonshowdown.com/sprites/trainers/${trainer.sprite}.png`" alt="">
            <div class="input-group my-3">
                <span class="input-group-text">Portrait</span>
                <select v-model="selectedSprite" class="form-select" @change="updateSprite">
                    <option v-for="(sprite, index) in sprites" :key="index" :value="sprite.value">
                        {{sprite.friendlyText}}
                    </option>
                </select>
            </div>
        </div>
        <hr>
        <!-- Trainer Origin -->
        <trainer-origin />
    </div>
</template>

<script>
import { getAllSprites } from '../../../api/game.api'
import { getTrainer, setTrainer } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
import TrainerOrigin from './TrainerOrigin.vue'
export default {
    name: 'Portrait',
    data() {
        return {
            trainer: getTrainer() || {
                honors: 0
            },
            sprites: [],
            selectedSprite: ''
        }
    },
    components: {
        TrainerOrigin
    },
    async beforeMount(){
        await getAllSprites()
            .then(response => {
                this.sprites = response.data
            })
            .catch(generateErrorModal);
    },
    methods: {
        updateSprite(){
            this.trainer.sprite = this.selectedSprite;
            setTrainer(this.trainer)
        }
    }
}
</script>
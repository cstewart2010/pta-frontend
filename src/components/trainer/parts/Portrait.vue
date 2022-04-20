<template>    
    <div class="col-md-4">
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
            <hr>
        </div>
        <!-- Trainer image -->
        <div class="row">
            <div class="text-center">Portrait</div>
            <hr>
            <img class="img-fluid" :src="`http://play.pokemonshowdown.com/sprites/trainers/${trainer.sprite}.png`" alt="">
            <select v-model="selectedSprite" class="form-select my-3" @change="updateSprite">
                <option v-for="(sprite, index) in sprites" :key="index" :value="sprite.value">
                    {{sprite.friendlyText}}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import { getAllSprites } from '../../../api/game.api'
import { getTrainer, setTrainer } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
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
    async beforeMount(){
        await getAllSprites()
            .then(response => {
                this.sprites = response.data
                console.log(response.data)
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
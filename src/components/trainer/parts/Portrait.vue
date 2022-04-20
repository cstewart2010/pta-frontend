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
            <select v-model="sprite" class="form-select my-3" @change="updateSprite">
                <option value="acetrainer">Ace Trainer (Male)</option>
                <option value="acetrainerf">Ace Trainer (Female)</option>
            </select>
        </div>
    </div>
</template>

<script>
import { getTrainer, setTrainer } from '../../../utils/localStorage'
export default {
    name: 'Portrait',
    data() {
        return {
            trainer: getTrainer() || {
                honors: 0
            },
            sprite: ''
        }
    },
    methods: {
        updateSprite(){
            this.trainer.sprite = this.sprite;
            setTrainer(this.trainer)
        }
    }
}
</script>
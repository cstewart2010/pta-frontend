<template>    
    <div class="col-md-4">
        <!-- Trainer level -->
        <div class="row">
            <div class="col-md-6">
                <div class="text-center">Honors</div>
                <div class="text-center">{{honors.length}}</div>
            </div>
            <div class="col-md-6">
                <div class="text-center">Level</div>
                <div class="text-center">{{level}}</div>
            </div>
        </div>
        <hr>
        <!-- Trainer image -->
        <div class="row">
            <div class="text-center">Portrait</div>
            <img class="img-fluid" :src="`http://play.pokemonshowdown.com/sprites/trainers/${sprite}.png`" alt="">
        </div>
    </div>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: 'Portrait',
    props: {
        trainerId: {
            default: ''
        }
    },
    data() {
        return {
            honors: [],
            level: 0,
            sprite: ''
        }
    },
    beforeMount(){
        var trainer = getCellParticipant(this.trainerId)
        this.honors = trainer.honors;
        this.level = trainer.level;
        this.sprite = trainer.sprite
    }
}
</script>
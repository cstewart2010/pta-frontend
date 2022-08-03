<template>    
    <div class="col-md-4">
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
        npcId: {
            default: ''
        }
    },
    data() {
        return {
            sprite: ''
        }
    },
    beforeMount(){
        var npc = getCellParticipant(this.npcId)
        this.sprite = npc.sprite
    }
}
</script>
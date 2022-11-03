<template>    
    <div class="col-md-4">
        <!-- Npc level -->
        <div class="row">
            <div class="input-group my-2">
                <span class="input-group-text ">Level</span>
                <input class="form-control" v-model="level" type="number" min="1"  @change="updateNpc('level', level)">
            </div>
        </div>
        <!-- Trainer image -->
        <div class="row">
            <div class="text-center">Portrait</div>
            <hr>
            <img class="img-fluid" :src="`http://play.pokemonshowdown.com/sprites/trainers/${npc.sprite}.png`" alt="">
            <select v-model="selectedSprite" class="form-select my-3" @change="updateSprite">
                <option v-for="(sprite, index) in sprites" :key="index" :value="sprite.value">
                    {{sprite.friendlyText}}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import { getAllSprites } from '../../api/game.api'
import { getDBSprites, getNpc, setDBSprites, setNpc } from '../../utils/localStorage'
import { generateErrorModal } from '../../utils/modalUtil'
export default {
    name: 'Portrait',
    data() {
        return {
            npc: getNpc(this.npcId),
            sprites: getDBSprites(),
            selectedSprite: '',
            level: 0
        }
    },
    props: {
        npcId: {
            default: null
        }

    },
    async beforeMount(){
        if (!this.sprites){
            await getAllSprites()
                .then(response => {
                    this.sprites = response.data
                    setDBSprites(this.sprites)
                })
                .catch(generateErrorModal);
        }
        this.level = this.npc.level;
    },
    methods: {
        updateSprite(){
            this.npc.sprite = this.selectedSprite;
            setNpc(this.npc)
        },
        updateNpc(section, value){
            const npc = getNpc(this.npcId);
            if(npc){
                npc[section] = value;
               setNpc(npc);
            }
        }
    }
}
</script>
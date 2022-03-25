<template>
    <div class="col-1 text-center">
        {{moveData.name}}
    </div>
    <div class="col-2 text-center">
        <div class="row">
            <div class="col-6">
                <input type="number" min="0" class="w-100">
            </div>
            <div class="col-6">
                {{moveData.frequency}}
            </div>
        </div>
    </div>
    <div class="col-2">
        <half-row-slot :left="moveData.range" :right="toHit" />
    </div>
    <div class="col-2 text-center">
        {{damageBase}}+{{damageAdditional}}
    </div>
    <div class="col-2 text-center">
        <div class="row">
            <div class="col-6">
                {{moveData.type}}
            </div>
            <div class="col-6">
                {{moveData.stat}}
            </div>
        </div>
    </div>
    <div class="col-2 text-center">
        {{moveData.effects}}
    </div>
</template>

<script>
import { getMove } from '../../../api/dex.api'
import { getTrainer } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'
import HalfRowSlot from '../../partials/HalvedRowSlot.vue'

export default {
    name: 'AddedMove',
    props: {
        move: {
            default: {
                name: 'Struggle'
            }
        },
        stats: {
            default: (getTrainer()||{}).trainerStats
        }
    },
    components: {
        HalfRowSlot
    },
    data(){
        return {
            moveData: {},
            toHit: '--',
            damageBase: '--',
            damageAdditional: '--'
        }
    },
    beforeMount:async function(){
        console.log(this)
        await getMove(this.move)
            .then(response => {
                this.moveData = response.data
                switch (this.moveData.stat){
                    case 'Attack':
                        this.toHit = Math.floor(this.stats.attack/2);
                        this.damageBase = this.moveData.diceRoll;
                        this.damageAdditional = this.toHit
                        break;
                    case 'Special':
                        this.toHit = Math.floor(this.stats.specialAttack/2);
                        this.damageBase = this.moveData.diceRoll;
                        this.damageAdditional = this.toHit
                        break;
                    case 'Effect':
                        this.toHit = Math.floor(this.stats.speed/2);
                        break;
                }
            })
            .catch(generateErrorModal);
    },
}
</script>
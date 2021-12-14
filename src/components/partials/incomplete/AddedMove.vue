<template>
    <div class="col-md-1 text-center">
        {{moveData.name}}
    </div>
    <div class="col-md-2 text-center">
        <div class="row">
            <div class="col-md-6">
                <input type="number" min="0" class="w-100">
            </div>
            <div class="col-md-6">
                {{moveData.frequency}}
            </div>
        </div>
    </div>
    <div class="col-md-2 text-center">
        <div class="row">
            <div class="col-md-6">
                {{moveData.range}}
            </div>
            <div class="col-md-6">
                {{toHit}}
            </div>
        </div>
    </div>
    <div class="col-md-2 text-center">
        {{damageBase}}+{{damageAdditional}}
    </div>
    <div class="col-md-2 text-center">
        <div class="row">
            <div class="col-md-6">
                {{moveData.type}}
            </div>
            <div class="col-md-6">
                {{moveData.stat}}
            </div>
        </div>
    </div>
    <div class="col-md-2 text-center">
        {{moveData.effects}}
    </div>
</template>

<script>
import { getMove } from '../../../api/dex.api'
import { getTrainer } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'

export default {
    name: 'AddedMove',
    props: {
        move: {
            default: {
                name: 'Struggle'
            }
        }
    },
    data(){
        return {
            moveData: {},
            trainerStats: getTrainer().trainerStats,
            toHit: '--',
            damageBase: '--',
            damageAdditional: '--'
        }
    },
    beforeMount:async function(){
        console.log(this.move);
        await getMove(this.move)
            .then(response => {
                this.moveData = response.data
                switch (this.moveData.stat){
                    case 'Attack':
                        this.toHit = Math.floor(this.trainerStats.attack/2);
                        this.damageBase = this.moveData.diceRoll;
                        this.damageAdditional = this.toHit
                        break;
                    case 'Special':
                        this.toHit = Math.floor(this.trainerStats.specialAttack/2);
                        this.damageBase = this.moveData.diceRoll;
                        this.damageAdditional = this.toHit
                        break;
                    case 'Effect':
                        this.toHit = Math.floor(this.trainerStats.speed/2);
                        break;
                }
            })
            .catch(generateErrorModal);
    },
}
</script>
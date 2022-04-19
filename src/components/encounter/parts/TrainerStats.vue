<template>
    <div class="row">
        <div class="col-10 text-center">
            Stats
        </div>
        <div class="col-2 text-center">
            Classes
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-10 my-auto">
            <div class="row d-flex align-items-center">
                <div class="col-2">
                    <div class="text-center">Current HP</div>
                    <div class="text-center">
                        {{trainer.currentHP}}
                    </div>
                    <div class="text-center">Max HP: {{trainer.trainerStats.hp}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Attack</div>
                    <div class="text-center">
                        {{trainer.trainerStats.attack}}
                    </div>
                    <div>+{{Math.floor(trainer.trainerStats.attack/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Defense</div>
                    <div class="text-center">
                        {{trainer.trainerStats.defense}}
                    </div>
                    <div>+{{Math.floor(trainer.trainerStats.defense/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>S. Attack</div>
                    <div class="text-center">
                        {{trainer.trainerStats.specialAttack}}
                    </div>
                    <div>+{{Math.floor(trainer.trainerStats.specialAttack/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>S. Defense</div>
                    <div class="text-center">
                        {{trainer.trainerStats.specialDefense}}
                    </div>
                    <div>+{{Math.floor(trainer.trainerStats.specialDefense/2)}}</div>
                </div>
                <div class="col-2 text-center">
                    <div>Speed</div>
                    <div class="text-center">
                        {{trainer.trainerStats.speed}}
                    </div>
                    <div>+{{Math.floor(trainer.trainerStats.speed/2)}}</div>
                </div>
            </div>
        </div>
        <div class="col-2 my-auto">
            <div class="text-center" v-for="(trainerClass, index) in trainer.trainerClasses" :key="index">
                {{trainerClass}}
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: 'TrainerStats',
    props: {
        trainerId: {
            default: ''
        }
    },
    data(){
        return {
            trainer: {}
        }
    },
    beforeMount(){
        this.trainer = getCellParticipant(this.trainerId)
    }
}
</script>
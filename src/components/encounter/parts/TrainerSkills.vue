<template>
    <div class="row">
        <div class="text-center">
            Skills
        </div>
        <div class="row d-flex align-items-center">
            <div class="col text-center">Skill Name</div>
            <div class="col text-center">Talent 1</div>
            <div class="col text-center">Talent 2</div>
            <div class="col text-center">Modifier</div>
        </div>
        <div class="row d-flex align-items-center" v-for="(trainerSkill, index) in trainer.trainerSkills" :key="index">
            <div class="col col-3 pl-2 text-truncate" data-bs-toggle="tooltip" :title="trainerSkill.name">{{trainerSkill.name}}</div>
            <div class="col col-3" style="text-align:center;">
                <input type="checkbox" :name="trainerSkill.name+'-talent-1'" :id="trainerSkill.name+'-talent-1'" :checked="trainer.trainerSkills[index].talent1" disabled>
            </div>
            <div class="col col-3" style="text-align:center;">
                <input type="checkbox" :name="trainerSkill.name+'-talent-2'" :id="trainerSkill.name+'-talent-2'" :checked="trainer.trainerSkills[index].talent2" disabled>
            </div>
            <div class="col col-3" style="text-align:center;" :id="trainerSkill.name+'-modifier'">
                <div v-if="trainer.trainerSkills[index].talent1 ^ trainer.trainerSkills[index].talent2">
                    +{{Math.floor(trainer.trainerStats[trainerSkill.modifierStat]/2) + 2}}
                </div>
                <div v-else-if="trainer.trainerSkills[index].talent1">
                    +{{Math.floor(trainer.trainerStats[trainerSkill.modifierStat]/2) + 5}}
                </div>
                <div v-else-if="trainer.trainerStats[trainerSkill.modifierStat] > 1">
                    +{{Math.floor(trainer.trainerStats[trainerSkill.modifierStat]/2)}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: "TrainerSkills",
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
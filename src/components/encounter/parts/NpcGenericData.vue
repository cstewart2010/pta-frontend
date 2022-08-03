<template>
    <div class="row">
        <div class="col">
            <div class="text-center">Name</div>
            <div class="text-center">
                {{npc.trainerName.toUpperCase()}}
            </div>
        </div>
        <div class="col">
            <div class="text-center">Species</div>
            <div class="text-center">
                {{npc.species}}
            </div>
        </div>
        <div class="col">
            <div class="text-center">Gender</div>
            <div class="text-center">
                {{npc.gender}}
            </div>
        </div>
        <div class="col">
            <div class="text-center">Height</div>
            <div class="text-center">
                {{npc.height}}
            </div>
        </div>
        <div class="col">
            <div class="text-center">Weight</div>
            <div class="text-center">
                {{npc.weight}}
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getCellParticipant } from '../../../utils/localStorage'
export default {
    name: "GenericData",
    props: {
        npcId: {
            default: ''
        }
    },
    data(){
        return {
            npc: {
                trainerName: ""
            }
        }
    },
    beforeMount(){
        this.npc = getCellParticipant(this.npcId)
    }
}
</script>
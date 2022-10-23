<template>
    <div class="modal fade" id="updateSettingModal" tabindex="-1" aria-labelledby="updateSettingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateSettingModalLabel">Update Settings</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <set-environment :socket="socket" />
                    <add-wild-pokemon :socket="socket" />
                    <add-npc :socket="socket" :npcs="npcs" :encounterMap="encounterMap" />
                    <add-npc-mon :socket="socket" :encounterMap="encounterMap" :npcs="npcs" />
                    <add-shop :shops="shops" :socket="socket" :encounterMap="encounterMap" />
                    <remove-from-encounter :activeParticipants="activeParticipants" :socket="socket" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SetEnvironment from './parts/SetEnvironmentForm.vue'
import AddWildPokemon from './parts/AddWildPokemonForm.vue'
import AddNpc from './parts/AddNpcForm.vue'
import AddNpcMon from './parts/AddNpcMonForm.vue'
import AddShop from './parts/AddShopForm.vue'
import RemoveFromEncounter from './parts/RemoveFromEncounterForm.vue'

export default {
    name: 'UpdateSetting',
    props: {
        socket: {
            default: {}
        },
        npcs: {
            default: []
        },
        encounterMap: {
            default: [[]]
        },
        shops: {
            default: []
        },
        activeParticipants: {
            default: []
        }
    },
    components: {
        SetEnvironment,
        AddWildPokemon,
        AddNpc,
        AddNpcMon,
        AddShop,
        RemoveFromEncounter
    }
}
</script>

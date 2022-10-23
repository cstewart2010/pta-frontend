<template>
    <div class="my-3" id="danger-zone">
        <div class="d-flex align-items-center">
            <h3 class="text-danger">Danger Zone</h3>
            <button class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#gameConfirmationModal" title="Delete the game">
                <i class="fa-solid fa-minus text-danger"></i>
            </button>
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" v-model="toggle" title="Toggle section visibility">
            </div>
            <button class="btn btn-lg" @click="refresh" title="Refresh npc list" v-if="isEnabled">
                <i :class="'fa fa-refresh'" aria-hidden="true"></i>
            </button>
        </div>
        <div v-if="toggle">
            <div class="row">
                <div class="my-2">
                    <input type="password" class="form-control" placeholder="Session Password" v-model="gameSessionPassword">
                </div>
                <div class="col-2">
                    <export-game :gameSessionPassword="gameSessionPassword" />
                </div>
            </div>
            <delete-game :gameSessionPassword="gameSessionPassword" />
        </div>
    </div>
</template>

<script>
import DeleteGame from '../modals/DeleteGame.vue'
import ExportGame from '../modals/ExportGame.vue'
export default {
    name: "DangerZoneSection",
    components: {
        DeleteGame,
        ExportGame
    },
    data(){
        return {
            gameSessionPassword: '',
            toggle: true
        }
    }
}
</script>
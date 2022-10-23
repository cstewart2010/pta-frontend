<template>
    <div class="my-3" id="danger-zone">
        <h3 class="text-danger">Danger Zone</h3>
        <div class="row">
            <input type="password" class="form-control" placeholder="Session Password" v-model="gameSessionPassword">
            <div class="col-2">
                <delete-game :gameSessionPassword="gameSessionPassword" />
            </div>
            <div class="col-2">
                <export-game :gameSessionPassword="gameSessionPassword" />
            </div>
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
            gameSessionPassword: ''
        }
    }
}
</script>
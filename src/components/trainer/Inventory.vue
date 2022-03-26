<template>
    <div class="row">
        <div class="col-12" style="text-align: center;">
            {{trainer.money}}¥
        </div>
        <div class="row">
            <key-items />
            <pokemon-items />
        </div>
        <div class="row">
            <medical-kit />
            <pokeballs />
        </div>
        <div class="row">
            <berries />
            <trainer-items />
        </div>
    </div>
</template>

<script>
import { getTrainer } from '../../utils/localStorage'
import KeyItems from './parts/KeyItems.vue'
import PokemonItems from './parts/PokemonItems.vue'
import MedicalKit from './parts/MedicalKit.vue'
import Pokeballs from './parts/Pokeballs.vue'
import Berries from './parts/Berries.vue'
import TrainerItems from './parts/TrainerItems.vue'
export default {
    name: 'Inventory',
    data() {
        return {
            trainer: getTrainer()
        }
    },
    components: {
        KeyItems,
        PokemonItems,
        MedicalKit,
        Pokeballs,
        Berries,
        TrainerItems,
    }
}
</script>
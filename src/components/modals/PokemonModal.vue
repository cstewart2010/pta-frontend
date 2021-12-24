<template>
    <div class="modal fade" :id="'pokemonModal'+pokemon.pokemonId" tabindex="-1" :aria-labelledby="'pokemonModalLabel'+pokemon.pokemonId" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header d-block">
                    <h5 class="modal-title" :id="'pokemonModalLabel'+pokemon.pokemonId">{{pokemon.nickname}}</h5>
                </div>
                <div class="modal-body">
                    <pokemon-modal-body :pokemon="pokemon" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PokemonModalBody from './parts/PokemonModalBody.vue'
export default {
    name: 'PokemonModal',
    props: {
        pokemon: {
            default: {}
        }
    },
    components: {
        PokemonModalBody
    }
}
</script>
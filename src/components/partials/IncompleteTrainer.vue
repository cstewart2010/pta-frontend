<template>
    <div v-if="sheet=='main'">
        <trainer-sheet />
    </div>
    <div v-else-if="sheet=='features'">
        <class-features />
    </div>
    <div v-else-if="sheet=='moves'">
        <trainer-moves />
    </div>
    <div v-else-if="sheet=='team'">
        <pokemon-team />
    </div>
    <div v-else-if="sheet=='home'">
        <pokemon-home />
    </div>
</template>

<script>
import TrainerSheet from './incomplete/TrainerSheet.vue';
import ClassFeatures from './ClassFeatures.vue';
import TrainerMoves from './TrainerMoves.vue';
import PokemonTeam from './PokemonTeam.vue';
import PokemonHome from './PokemonHome.vue';

export default {
    name: "IncompleteTrainer",
    components: {
        TrainerSheet,
        ClassFeatures,
        TrainerMoves,
        PokemonTeam,
        PokemonHome,
    },
    props: {
        sheet: {
            default: 'main'
        }
    }
}
</script>
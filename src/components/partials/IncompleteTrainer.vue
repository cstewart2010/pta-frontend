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
</template>

<script>
import TrainerSheet from './incomplete/TrainerSheet.vue';
import ClassFeatures from './ClassFeatures.vue';
import TrainerMoves from './TrainerMoves.vue';

export default {
    name: "Incomplete Trainer",
    components: {
        TrainerSheet,
        ClassFeatures,
        TrainerMoves
    },
    props: {
        sheet: {
            default: 'main'
        }
    }
}
</script>
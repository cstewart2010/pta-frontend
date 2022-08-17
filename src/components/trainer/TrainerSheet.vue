<template>
    <div class="row">
        <left />
    </div>
    <hr>
    <bottom />
</template>

<script>
import Left from './parts/Left.vue'
import Bottom from './parts/Bottom.vue'

export default {
    name: "TrainerSheet",
    components: {
        Left,
        Bottom
    }
}
</script>
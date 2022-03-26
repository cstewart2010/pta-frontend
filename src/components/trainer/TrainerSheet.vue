<template>
    <div class="row">
        <left />
        <!-- Trainer wishlist -->
        <div class="col-md-1 text-center">
            <div>Wishlist</div>
            <input v-for="n in 20" :key="n" type="text" class="wishlist w-100">
        </div>
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
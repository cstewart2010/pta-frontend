<template>
    <div class="row">
        <left />
        <!-- Trainer wishlist -->
        <div class="col-md-1 text-center">
            Wishlist
            <input v-for="n in 20" :key="n" type="text" class="wishlist">
        </div>
    </div>
    <hr>
    <bottom />
</template>

<script>
import Left from './incomplete/Left.vue'
import Bottom from './incomplete/Bottom.vue'

export default {
    name: "TrainerSheet",
    components: {
        Left,
        Bottom
    }
}
</script>
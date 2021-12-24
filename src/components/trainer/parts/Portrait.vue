<template>    
    <div class="col-md-4">
        <!-- Trainer level -->
        <div class="row">
            <div class="col-md-6">
                <div class="text-center">Honors</div>
                <div class="text-center">{{trainer.honors.length}}</div>
            </div>
            <div class="col-md-6">
                <div class="text-center">Level</div>
                <div class="text-center">{{trainer.level}}</div>
            </div>
            <hr>
        </div>
        <!-- Trainer image -->
        <div class="row">
            <div class="text-center">Portrait</div>
            <hr>
            <img class="rounded mx-auto d-block" src="https://64.media.tumblr.com/335d9c582288054a4746c5515c748fbe/tumblr_pnm47d3ndK1w7c1ka_1280.jpg" alt="">
        </div>
    </div>
</template>

<script>
import { getTrainer } from '../../../utils/localStorage'
export default {
    name: 'Portrait',
    data() {
        return {
            trainer: getTrainer() || {
                honors: 0
            }
        }
    }
}
</script>
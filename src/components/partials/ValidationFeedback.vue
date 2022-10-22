<template>
    <div class="valid-feedback" v-if="useValid">
        {{good}}
    </div>
    <div class="invalid-feedback" v-if="useInvalid">
        {{name}} {{bad}}
    </div>
</template>

<script>
export default {
    name: 'ValidationFeedback',
    props: {
        name: {
            default: ''
        },
        useValid: {
            default: true
        },
        useInvalid: {
            default: true
        }
    },
    data(){
        return {
            good: 'Looks good!',
            bad: 'must be alphanumeric (spaces allowed), and between 6 and 18 characters',
        }
    }
}
</script>
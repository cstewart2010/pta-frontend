<template>
    <div class="row">
        <div class="col-md-6">
            {{left}}
        </div>
        <div class="col-md-6">
            {{right}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'HalvedRowSlot',
    props: {
        left: {
            default: null
        },
        right: {
            default: null
        }
    }
}
</script>
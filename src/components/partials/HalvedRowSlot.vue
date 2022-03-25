<template>
    <div class="row">
        <div class="col-6 text-truncate" data-bs-toggle="tooltip" :title="left">
            {{left}}
        </div>
        <div class="col-6 text-truncate" data-bs-toggle="tooltip" :title="right">
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
<template>
    <div></div>
</template>

<script>

export default {
    name: 'GamesRedirect',
    props: {
        'nickname': null
    },
    mounted:function(){
        this.$router.push({
            name: 'Games',
            params: {
                nickname: this.nickname
            }
        })
    }
}
</script>

<template>
    <h1>Made it here</h1>
</template>

<script>

export default ({
    name: "NextPage",
    props: {
        trainerId: null,
        activityToken: null,
        sessionAuth: null,
    },
    mounted:function(){
        if (!(this.trainerId && this.activityToken && this.sessionAuth)){
            this.$router.push('/');
        }
    },
    setup() {
        
    },
})
</script>

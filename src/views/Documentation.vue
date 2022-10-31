<template>
  <div id="documentation">
    <h1>Documentation</h1>
  </div>
</template>

<script>
export default {
  name: 'Documentation',
  data(){
    return {
      modalName: '',
      modalSrc: ''
    }
  },
  methods: {
    updateModalThings(name, src){
      this.modalName = name
      this.modalSrc = src
    }
  }
}
</script>
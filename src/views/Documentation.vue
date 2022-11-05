<template>
  <div id="documentation">
    <h1>Documentation</h1>
    <div class="row">
      <div class="row col-12 my-2" v-for="(doc, index) in Object.keys(modalData)" :key="index">
        <button class="btn btn-primary col-3" data-bs-toggle="modal" data-bs-target="#documentationModal"  @click="updateModalThings(doc, modalData[doc])">
          {{doc}}
        </button>
      </div>
    </div>
    <documentation-modal :modalName="modalName" :modalSrc="modalSrc"/>
  </div>
</template>

<script>
import DocumentationModal from '../components/modals/DocumentationModal.vue'
export default {
  name: 'Documentation',
  data(){
    return {
      modalName: '',
      modalSrc: '',
      modalData: {
        "PTA 3 Character Sheets": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3CharacterSheets.pdf',
        "PTA 3 GameMastersGuide": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3GameMastersGuide.pdf',
        "PTA 3 GameMastersScreen": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3GameMastersScreen.pdf',
        "PTA 3 PlayersHandbook": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3PlayersHandbook.pdf',
        "PTA 3 PlayersHandbook 2": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3PlayersHandbook2.pdf',
        "PTA 3 Pokedex": 'https://storageapi.fleek.co/90eb850c-2469-43fc-b6b8-2fc1e7b95aa9-bucket/PTA3Pokedex.pdf',
      }
    }
  },
  components:{
    DocumentationModal
  },
  methods: {
    updateModalThings(name, src){
      this.modalName = name
      this.modalSrc = src
    }
  }
}
</script>
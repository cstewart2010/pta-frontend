<template>
    <div class="col-1 text-center" :id="'position-'+position">{{position}}</div>
    <div class="col-3 text-center" :id="'icon-'+position">
        <img :src="url" :alt="pokemonData.name">
    </div>
    <button class="col-3 text-center btn btn-info" :id="'nickname-'+position" @click="changeDisplay">{{pokemonData.nickname}} ({{pokemonData.speciesName}})</button>
    <div class="col-3 text-center" :id="'notes-'+position" v-if="trainerId == pokemonData.trainerId">
        <span v-if="trainerId == pokemonData.originalTrainerId">Original Trainer<br></span>
        {{this.pokemonData.rarity}}
        <span v-if="pokemonData.isShiny"><br>Shiny</span>
    </div>
    <section v-if="display">
        <pokemon-modal-body :pokemon="pokemonData" />
    </section>
</template>

<script>
import { getGamePokemon } from '../../../api/pokemon.api'
import { generateErrorModal } from '../../../utils/modalUtil'
import PokemonModalBody from '../../modals/parts/PokemonModalBody.vue'

export default {
    name: 'ActualPokemon',
    props: {
        pokemonId: {
            default: 'pikachu'
        },
        position: {
            default: 1
        },
        trainerId: {
            default: null
        }
    },
    components: {
        PokemonModalBody
    },
    data(){
        return {
            pokemonData: {
                name: '',
                pokemonStats: '',
                eggGroups: [],
                proficiencies: [],
                passives: [],
                skills: [],
            },
            url: '',
            hp: 1,
            display: false
        }
    },
    beforeMount:async function(){
        await getGamePokemon(this.pokemonId)
            .then(response => {
                this.pokemonData = response.data
                this.url = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/'+response.data.speciesName.toLowerCase().replace(' ', '-')+'.png'
                this.hp = JSON.parse(localStorage.getItem(`${this.pokemonId}hp`) || response.data.pokemonStats.hp)
            })
            .catch(generateErrorModal)
    },
    methods: {
        updateHP() {
            localStorage.setItem(`${this.pokemonId}hp`, this.hp)
        },
        changeDisplay(){
            this.display = !this.display;
        }
    }
}
</script>
<template>
    <div class="col-md-1 text-center" :id="'position-'+position">{{position}}</div>
    <div class="col-md-1 text-center" :id="'icon-'+position">
        <img :src="url" :alt="pokemonData.name">
    </div>
    <div class="col-md-3 text-center" :id="'nickname-'+position">{{pokemonData.nickname}} ({{pokemonData.speciesName}})</div>
    <div class="col-md-2 text-center" :id="'current-hp-'+position">
        <input type="number" v-model="hp" :max="pokemonData.pokemonStats.hp" @change="updateHP">
    </div>
    <div class="col-md-4 text-center" :id="'notes-'+position" v-if="trainerId == pokemonData.trainerId">
        <span v-if="trainerId == pokemonData.originalTrainerId">Original Trainer<br></span>
        {{this.pokemonData.rarity}}
        <span v-if="pokemonData.isShiny"><br>Shiny</span>
        </div>
</template>

<script>
import { getGamePokemon } from '../../../api/pokemon.api'
import { generateErrorModal } from '../../../utils/modalUtil'

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
    data(){
        return {
            pokemonData: {
                name: '',
                pokemonStats: ''
            },
            url: 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/pikachu.png',
            hp: 1
        }
    },
    beforeMount:async function(){
        await getGamePokemon(this.pokemonId)
            .then(response => {
                this.pokemonData = response.data
                this.url = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/'+response.data.speciesName.toLowerCase().replace(' ', '-')+'.png'
                this.hp = JSON.parse(localStorage.getItem(`${this.pokemonId}hp`)) || response.data.pokemonStats.hp
            })
            .catch(generateErrorModal)
    },
    methods: {
        updateHP() {
            localStorage.setItem(`${this.pokemonId}hp`, this.hp)
        }
    }
}
</script>
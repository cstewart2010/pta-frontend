<template>
    <div class="col-md-1 text-center" :id="'position-'+position">{{position}}</div>
    <div class="col-md-1 text-center" :id="'icon-'+position">
        <img :src="url" :alt="pokemonData.name">
    </div>
    <div class="col-md-2 text-center" :id="'nickname-'+position">
        <input type="text" v-model="nickname" class="w-100">
    </div>
    <div class="col-md-1 text-center" :id="'species-'+position">{{pokemonData.name}}</div>
    <div class="col-md-2 text-center" :id="'current-hp-'+position">{{pokemonData.pokemonStats.hp}}</div>
    <div class="col-md-4 text-center" :id="'notes-'+position">Original Trainer <br> {{this.pokemonData.rarity}}</div>
</template>

<script>
import { getPokemon } from '../../../api/dex.api'
import { generateErrorModal } from '../../../utils/modalUtil'

export default {
    name: 'AddedPokemon',
    props: {
        pokemon: {
            default: 'pikachu'
        },
        position: {
            default: 1
        }
    },
    data(){
        return {
            pokemonData: {
                name: '',
                pokemonStats: ''
            },
            url: 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/pikachu.png',
            nickname: ''
        }
    },
    beforeMount:async function(){
        await getPokemon(this.pokemon)
            .then(response => {
                this.pokemonData = response.data
                this.url = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/'+response.data.name.toLowerCase().replace(' ', '-')+'.png'
                this.nickname = response.data.name
            })
            .catch(generateErrorModal)
    },
}
</script>
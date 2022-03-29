<template>
    <div class="col-1 text-center" :id="'position-'+position">{{position}}</div>
    <div class="col-1 text-center" :id="'icon-'+position">
        <img :src="url" :alt="pokemonData.name">
    </div>
    <div class="col-2 text-center" :id="'nickname-'+position">
        <input type="text" minlength="1" maxlength="18" v-model="nickname" class="w-100" @change="updateNickname">
    </div>
    <div class="col-1 text-center" :id="'species-'+position">{{pokemonData.name}}</div>
    <div class="col-2 text-center" :id="'current-hp-'+position">{{pokemonData.pokemonStats.hp}}</div>
    <div class="col-4 text-center" :id="'notes-'+position">Original Trainer<br>{{pokemonData.rarity}}</div>
</template>

<script>
import { getPokemon } from '../../../api/dex.api'
import { getPokemonNewHome, getPokemonNewTeam, setPokemonNewHome, setPokemonNewTeam } from '../../../utils/localStorage'
import { generateErrorModal } from '../../../utils/modalUtil'

export default {
    name: 'AddedPokemon',
    props: {
        pokemon: {
            default: 'pikachu'
        },
        position: {
            default: 1
        },
        isOnActiveTeam : {
            default: false
        }
    },
    data(){
        return {
            pokemonData: {
                name: '',
                pokemonStats: ''
            },
            url: '',
            nickname: ''
        }
    },
    beforeMount:async function(){
        await getPokemon(this.pokemon.speciesName)
            .then(response => {
                this.pokemonData = response.data
                this.url = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/'+response.data.name.toLowerCase().replace(' ', '-')+'.png'
                this.nickname = response.data.name
            })
            .catch(generateErrorModal)
    },
    methods: {
        updateNickname(){
            if (this.isOnActiveTeam) {
                const team = getPokemonNewTeam()
                team[this.position - 1].nickname = this.nickname
                setPokemonNewTeam(team)
            }
            else {
                const home = getPokemonNewHome()
                home[this.position - 1].nickname = this.nickname
                setPokemonNewHome(home);
            }
        }
    }
}
</script>
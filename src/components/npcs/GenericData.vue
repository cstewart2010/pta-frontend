<template>
    <div class="row">
        <div class="col">
            <div class="text-center">Name</div>
            <div class="text-center">{{trainerName.toUpperCase()}}</div>
        </div>
        <div class="col">
            <div class="text-center">Species</div>
            <div class="text-center" v-if="pokemonCol">
                <select class="form-select text-center my-1 w-100" v-model="species" @change="updateNpc('species', species)">
                    <option value="Human">Human</option> 
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon.name" :value="pokemon.name">
                        {{pokemon.name}}
                    </option>
                </select>
                {{updateNpc('species', species)}}
            </div>
           
        </div>
        <div class="col">
            <div class="text-center">Gender</div>
            <div class="text-center">
                <select class="form-select text-center w-100" v-model="gender" name="gender" id="genders" @change="updateNpc('gender', gender)">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="genderless">Agender</option>
                </select>
            </div>
        </div>
        <div class="col">
            <div class="text-center">Height</div>
            <div class="text-center">
                <input class="w-75" v-model="height" type="number" min="1"  @change="updateNpc('height', height)"> ins
            </div>
        </div>
        <div class="col">
            <div class="text-center">Weight</div>
            <div class="text-center">
                <input class="w-75" v-model="weight" type="number" min="1" @change="updateNpc('weight', weight)"> lbs
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getAllBasePokemon } from '../../api/dex.api'
import {getDBFullPokedex, getNpc, setDBFullPokedex, setNpc} from '../../utils/localStorage'
export default {
    name: "GenericData",
    props:{
        npcId: {
            default: ""
        }
    },
    data() {
         return {
            pokemonCol: getDBFullPokedex(),
            species: '',
            trainerName: '',
            gender: 'male',
            height: 0,
            weight: 0
        }
    },
    async beforeMount(){
        const npc = getNpc(this.npcId);
        this.trainerName = npc.trainerName;
        this.gender = npc.gender;
        this.height = npc.height;
        this.weight = npc.weight;
        if (this.origin.includes('Pokémon')){
            await getAllBasePokemon()
                .then(response => {
                    this.pokemonCol = response.data
                    setDBFullPokedex(this.pokemonCol)
                })
        }
    },

    methods: {
        updateNpc(section, value){
            const npc = getNpc(this.npcId);
            if(npc){
                npc[section] = value;
               setNpc(npc);
            }
        }
    }
}
</script>
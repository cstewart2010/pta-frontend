<template>
    <div class="row">
           <div class="col-2">
            <div class="text-center">Name</div>
            <div class="text-center">{{trainerName.toUpperCase()}}</div>
        </div>
    </div>
    <div class="col-2">
            <div class="text-center">Species</div>
            <div class="text-center" v-if="origin.includes('Pokémon')">
                <select class="form-select text-center my-1 w-100" v-model="species" @change="updateNpc('species', species)">
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon" :value="pokemon">
                        {{pokemon}}
                    </option>
                </select>
                {{updateTrainer('species', species)}}
            </div>
</template>

<script>
import { getAllPokemon } from '../../api/dex.api'
import {getNpc, setNpc} from '../../utils/localStorage'
export default {
    name: "GenericData",
    props:{
        npcId: {
            default: ""
        }
    },
    data() {
         return {
            pokemonCol: [],
            species: '',
            trainerName: '',
            gender: 'male',
            height: 0,
            weight: 0
        }
    },
    beforeMount: async function(){
         await getAllPokemon()
            .then(response => {
                this.pokemonCol = response.data.results.map(item => item.name)
                const npc = getNpc()
                this.trainerName = npc.trainerName;
                this.gender = npc.gender;
                this.height = npc.height;
                this.weight = npc.weight;
            })
    },
    methods: {
        updateNpc(section, value){
            const npc = getNpc(this.npcId);
            if(npc){
                this.origin = npc.origin;
                npc[section] = value;
               setNpc(npc);
            }
        }
    }
}
</script>
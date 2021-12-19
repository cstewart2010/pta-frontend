<template>
    <div class="row">
        <div class="col-md-2">
            <div class="text-center">Name</div>
            <div class="text-center">{{trainerName.toUpperCase()}}</div>
        </div>
        <div class="col-md-2">
            <div class="text-center">Species</div>
            <div class="text-center" v-if="origin.includes('Pokémon')">
                <select class="form-select text-center my-1 w-100" v-model="species" @change="updateTrainer('species', species)">
                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon" :value="pokemon">
                        {{pokemon}}
                    </option>
                </select>
                {{updateTrainer('species', species)}}
            </div>
            <div class="text-center" v-else>Human {{updateTrainer('species', 'Human')}}</div>
        </div>
        <div class="col-md-2">
            <div class="text-center">Age</div>
            <div class="text-center">
                <input class="w-50" type="number" min="0" v-model="age" @change="updateTrainer('age', age)"> yo
            </div>
        </div>
        <div class="col-md-2">
            <div class="text-center">Gender</div>
            <div class="text-center">
                <select class="form-select text-center w-100" v-model="gender" name="gender" id="genders" @change="updateTrainer('gender', gender)">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="genderless">Agender</option>
                </select>
            </div>
        </div>
        <div class="col-md-2">
            <div class="text-center">Height</div>
            <div class="text-center">
                <input class="w-75" v-model="height" type="number" min="1"  @change="updateTrainer('height', height)"> ins
            </div>
        </div>
        <div class="col-md-2">
            <div class="text-center">Weight</div>
            <div class="text-center">
                <input class="w-75" v-model="weight" type="number" min="1" @change="updateTrainer('weight', weight)"> lbs
            </div>
        </div>
    </div>
    <hr>
</template>

<script>
import { getAllPokemon } from '../../../api/dex.api'
import { getTrainer, setTrainer } from '../../../utils/localStorage'
export default {
    name: "GenericData",
    data() {
        return {
            pokemonCol: [],
            species: '',
            trainerName: '',
            age: 0,
            gender: 'male',
            height: 0,
            weight: 0,
            origin: ''
        }
    },
    beforeMount: async function(){
        await getAllPokemon()
            .then(response => {
                this.pokemonCol = response.data.results.map(item => item.name)
                const trainer = getTrainer()
                this.trainerName = trainer.trainerName;
                this.age = trainer.age;
                this.gender = trainer.gender;
                this.height = trainer.height;
                this.weight = trainer.weight;
                this.origin = trainer.origin;
            })
    },
    methods: {
        updateTrainer(section, value){
            const trainer = getTrainer()
            this.origin = trainer.origin;
            trainer[section] = value;
            setTrainer(trainer);
        }
    }
}
</script>
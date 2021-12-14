<template>
    <div class="row">
        <div class="col-md-11">
            <div class="row">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-2">
                            <div class="text-center">Name</div>
                            <div class="text-center">{{trainer.trainerName.toUpperCase()}}</div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">Species</div>
                            <div class="text-center" v-if="trainer.origin.includes('Pokémon')">
                                <select class="form-select text-center my-1 w-100" v-model="species" @change="updateTrainer">
                                    <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon" :value="pokemon">
                                        {{pokemon}}
                                    </option>
                                </select>
                            </div>
                            <div class="text-center" v-else>Human</div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">Age</div>
                            <div class="text-center">
                                <input class="w-50" type="number" min="0" v-model="trainer.age" @change="updateTrainer"> yo
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">Gender</div>
                            <div class="text-center">
                                <select class="form-select text-center w-100" v-model="trainer.gender" name="gender" id="gneders" @change="updateTrainer">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="genderless">Agender</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">Height</div>
                            <div class="text-center">
                                <input class="w-75" v-model="trainer.height" type="number" min="1"  @change="updateTrainer"> ins
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">Weight</div>
                            <div class="text-center">
                                <input class="w-75" v-model="trainer.weight" type="number" min="1" @change="updateTrainer"> lbs
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-10 my-auto">
                            <div class="text-center">Stats</div>
                        </div>
                        <div class="col-md-2 my-auto">
                            <div class="text-center">Classes</div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-10 my-auto">
                            <div class="row d-flex align-items-center">
                                <div class="col-md-2">
                                    <div class="text-center">Current HP</div>
                                    <div class="text-center">20</div>
                                    <div class="text-center">Max HP: 20</div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div>Attack</div>
                                    <input class="w-100" type="number" min="1" max="10" v-model="trainer.trainerStats.attack" @change="updateTrainer">
                                    <div>+{{Math.floor(trainer.trainerStats.attack/2)}}</div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div>Defense</div>
                                    <input class="w-100" type="number" min="1" max="10" v-model="trainer.trainerStats.defense" @change="updateTrainer">
                                    <div>+{{Math.floor(trainer.trainerStats.defense/2)}}</div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div>S. Attack</div>
                                    <input class="w-100" type="number" min="1" max="10" v-model="trainer.trainerStats.specialAttack" @change="updateTrainer">
                                    <div>+{{Math.floor(trainer.trainerStats.specialAttack/2)}}</div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div>S. Defense</div>
                                    <input class="w-100" type="number" min="1" max="10" v-model="trainer.trainerStats.specialDefense" @change="updateTrainer">
                                    <div>+{{Math.floor(trainer.trainerStats.specialDefense/2)}}</div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div>Speed</div>
                                    <input class="w-100" type="number" min="1" max="10" v-model="trainer.trainerStats.speed" @change="updateTrainer">
                                    <div>+{{Math.floor(trainer.trainerStats.speed/2)}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 my-auto">
                            <div class="row d-flex align-items-center">
                                <div class="text-center">
                                    <select class="form-select" name="trainerClass"  v-model="trainer.trainerClasses[0]" @change="updateClass">
                                        <option v-for="(trainerClass, index) in trainerClasses" :key="index" :id="trainerClass" :value="trainerClass.replace('/', '_')">
                                            {{trainerClass}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="text-center">Skills</div>
                        </div>
                        <div class="col-md-6">
                            <select class="form-select text-center" name="origin" v-model="trainer.origin" @change="updateOrigin">
                                <option v-for="(origin, index) in origins" :key="index" :id="origin" :value="origin.replace('/', '_')">
                                    {{origin}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row d-flex align-items-center">
                                <div class="col-md-4">Skill Name</div>
                                <div class="col-md-4">Talent 1</div>
                                <div class="col-md-4">Talent 2</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="text-center">{{selectedOrigin.name}} Specialty</div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row d-flex align-items-center" v-for="(trainerSkill, index) in trainer.trainerSkills" :key="index">
                                <div class="col-md-4 pl-2 text-truncate" data-bs-toggle="tooltip" :title="trainerSkill">{{trainerSkill.name}}</div>
                                <div class="col-md-4" style="text-align:center;">
                                    <input type="checkbox" :name="trainerSkill.name+'-talent-1'" :id="trainerSkill.name+'-talent-1'" :checked="this.trainer.trainerSkills[index].talent1" @change="updateTalent1(index)">
                                </div>
                                <div class="col-md-4" style="text-align:center;">
                                    <input type="checkbox" :name="trainerSkill.name+'-talent-2'" :id="trainerSkill.name+'-talent-2'" :checked="this.trainer.trainerSkills[index].talent2" @change="updateTalent2(index)">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 my-auto">
                            <div class="text-center">
                                <p>Starting Equipment: {{selectedOrigin.equipment}}</p>
                                <p>Starting pokemon: {{selectedOrigin.startingPokemon}}</p>
                                <div v-if="selectedOrigin.feature">
                                    <p>Origin Feature: {{selectedOrigin.feature.name}}</p>
                                    <p>{{selectedOrigin.feature.effects}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="text-center">Honors</div>
                            <div class="text-center">{{trainer.honors.length}}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="text-center">Level</div>
                            <div class="text-center">{{trainer.level}}</div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="text-center">Portrait</div>
                    </div>
                    <hr>
                    <img class="rounded mx-auto d-block" src="https://64.media.tumblr.com/335d9c582288054a4746c5515c748fbe/tumblr_pnm47d3ndK1w7c1ka_1280.jpg" alt="">
                </div>
            </div>
        </div>
        <div class="col-md-1 text-center">
            Wishlist
            <input v-for="n in 20" :key="n" type="text" class="wishlist">
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-md-6">
            <div class="text-center">Physical Description</div>
            <textarea v-model="trainer.description" class="w-100" @input="updateTrainer" />
            <div class="text-center">Personality</div>
            <textarea v-model="trainer.personality" class="w-100" @input="updateTrainer" />
        </div>
        <div class="col-md-6">
            <div class="text-center">Background</div>
            <textarea v-model="trainer.background" class="w-100" @input="updateTrainer" />
            <div class="text-center">Goals / Dreams / Obsessions</div>
            <textarea v-model="trainer.goals" class="w-100" @input="updateTrainer" />
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-md-1 text-center">Number</div>
        <div class="col-md-1 text-center">Icon</div>
        <div class="col-md-2 text-center">Nickname</div>
        <div class="col-md-1 text-center">Species</div>
        <div class="col-md-2 text-center">Current HP</div>
        <div class="col-md-4 text-center">Notes</div>
        <div class="col-md-1 text-center">Delete</div>
    </div>
    <div id="addedPokemon" class="my-1">
        <div v-for="(pokemon, index) in pokemonTeam" :key="pokemon">
            <div class="row d-flex align-items-center" :id="'pokemon-'+index">
                <added-pokemon :pokemon="pokemon" :position="index + 1" />
                <div class="col-md-1 text-center">
                    <button class="btn-close" @click="remove(index)" />
                </div>
            </div>
            <hr/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <select class="form-select text-center my-1" name="pokemon" v-model="addedPokemon">
                <option v-for="(pokemon, index) in pokemonCol" :key="index" :id="pokemon" :value="index + 1">
                    {{pokemon}}
                </option>
            </select>
            <button class="btn btn-primary my-1" @click="addPokemon">Add this pokemon</button>
        </div>
    </div>
</template>

<script>
import { getAllOrigins, getAllPokemon, getAllTrainerClasses, getOrigin, getTrainerClass } from '../../../api/dex.api'
import { getTrainer, setTrainer } from '../../../utils/localStorage';
import { generateErrorModal } from '../../../utils/modalUtil'
import AddedPokemon from './AddedPokemon.vue';

export default {
    name: "TrainerSheet",
    components: {
        AddedPokemon
    },
    data(){
        return {
            origins: [],
            trainerClasses: [],
            pokemonCol: [],
            pokemonTeam: [],
            pokemonHome: [],
            addedPokemon: '',
            species: '',
            trainer: getTrainer(),
            selectedOrigin: 'Academic',
            selectedClass: 'Ace Trainer'
        }
    },
    mounted:async function(){
        await getAllOrigins()
            .then(response => {
                this.origins = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);
        
        await getAllTrainerClasses()
            .then(response => {
                this.trainerClasses = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);
        
        await getAllPokemon()
            .then(response => {
                this.pokemonCol = response.data.results.map(item => item.name)
            })
            .catch(generateErrorModal);

        // this.trainer = getTrainer();
        await this.updateClass();
        await this.updateOrigin();
    },
    methods:{
        async updateClass(){
            if (this.trainer.trainerClasses.length > 0){
                await getTrainerClass(this.trainer.trainerClasses[0])
                    .then(response => {
                        this.selectedClass = response.data,
                        this.updateTrainer();
                    })
                    .catch(generateErrorModal);
            }
        },
        async updateOrigin(){
            if (this.trainer.origin){
                await getOrigin(this.trainer.origin)
                    .then(response => {
                        this.selectedOrigin = response.data
                        this.updateTrainer();
                    })
                    .catch(generateErrorModal);
            }
        },
        addPokemon(){
            if (this.pokemonTeam.length == 6){
                this.pokemonHome.push(this.addedPokemon);
            }
            else{
                this.pokemonTeam.push(this.addedPokemon);
            }
        },
        remove(index){
            this.pokemonTeam = this.pokemonTeam.filter((pokemon, entryIndex) => entryIndex != index)
        },
        updateTalent1(index){
            this.trainer.trainerSkills[index].talent1 = !this.trainer.trainerSkills[index].talent1
            setTrainer(this.trainer);
        },
        updateTalent2(index){
            this.trainer.trainerSkills[index].talent2 = !this.trainer.trainerSkills[index].talent2
            setTrainer(this.trainer);
        },
        updateTrainer(){
            if (this.trainer.origin.includes("Pokémon")){
                this.trainer.species = this.species
            }
            else{
                this.trainer.species = "Human"
            }
            setTrainer(this.trainer);
        }
    }
}
</script>
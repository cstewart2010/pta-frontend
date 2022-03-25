<template>
    <div class="row my-2">
        <div class="col-md-8">
            <div class="row">
                <div class="col-md-5">
                    Data
                    <hr>
                    <halved-row-slot left="Nickname" :right="pokemon.nickname" />
                    <halved-row-slot left="Species" :right="pokemon.speciesName" />
                    <halved-row-slot left="Gender" :right="pokemon.gender" />
                    <halved-row-slot left="Type" :right="pokemon.type" />
                    <halved-row-slot left="Nature" :right="pokemon.nature" />
                    <halved-row-slot left="Size" :right="pokemon.size" />
                    <halved-row-slot left="Weight" :right="pokemon.weight" />
                    <halved-row-slot left="Egg Group" :right="pokemon.eggGroups.join('/')" />
                    <halved-row-slot left="Hatch rate" :right="pokemon.eggHatchRate" />
                    <halved-row-slot left="Diet" :right="pokemon.diet" />
                    Proficiencies:<br>{{pokemon.proficiencies.join(', ')}}
                </div>
                <div class="col-md-5">
                    Modifiers
                    <hr>
                    <div class="row my-2">
                        <div class="col-md-4">
                            Current HP
                            <br>
                            <input class="w-50" type="number" :min="-pokemon.pokemonStats.hp" :max="pokemon.pokemonStats.hp" v-model="hp" @input="updateCatchRate">
                        </div>
                        <div class="col-md-4">
                            Max HP<br>{{pokemon.pokemonStats.hp}}
                        </div>
                        <div class="col-md-4">
                            Move Speed<br>{{pokemon.pokemonStats.speed*5}} ft
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4">
                            Attack modifier<br>{{Math.floor(pokemon.pokemonStats.attack/2)}}
                        </div>
                        <div class="col-md-4">
                            Special Attack modifier<br>{{Math.floor(pokemon.pokemonStats.specialAttack/2)}}
                        </div>
                        <div class="col-md-4">
                            Speed Modifier<br>{{Math.floor(pokemon.pokemonStats.speed/2)}}
                        </div>
                    </div>
                    <hr>
                    <halved-row-slot left="Catch Rate" :right="catchRate" />
                    <hr>
                    <div class="row">
                        <div class="col-md-6">                            
                            <select class="form-select" v-model="selectedItem" @change="updateItem">
                                <option v-for="(item, index) in items" :key="index" :id="item" :value="item">
                                    {{item}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            {{itemData}}
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    {{pokemon.nickname}}
                    <hr>
                    <img class="img-fluid" src="https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/imagesHQ/001.png" :alt="pokemon.nickname">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            Passives
            <hr>
                <div class="row" v-for="(passive, index) in pokemon.passives" :key="index">
                    <passive :passiveName="passive" />
                </div>
            <div>
                <select class="form-select" v-model="selectedSkill" @change="updateSkill">
                    <option v-for="(skill, index) in pokemon.skills" :key="index" :id="skill" :value="skill">
                        {{skill}}
                    </option>
                </select>
                {{skillData}}
            </div>
        </div>
    </div>
    <hr/>
    <div class="row">
        <div class="col-11">
            <div class="row">
                <div class="col-2">HP</div>
                <div class="col-2">Attack</div>
                <div class="col-2">Defense</div>
                <div class="col-2">Special Attack</div>
                <div class="col-2">Special Defense</div>
                <div class="col-2">Speed</div>
            </div>
            <hr>
            <div class="row">
                <div class="col-2">{{pokemon.pokemonStats.hp}}</div>
                <div class="col-2">{{pokemon.pokemonStats.attack}}</div>
                <div class="col-2">{{pokemon.pokemonStats.defense}}</div>
                <div class="col-2">{{pokemon.pokemonStats.specialAttack}}</div>
                <div class="col-2">{{pokemon.pokemonStats.specialDefense}}</div>
                <div class="col-2">{{pokemon.pokemonStats.speed}}</div>
            </div>
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-1">Name</div>
        <div class="col-2">
            <halved-row-slot left="Uses" right="Frequency" />
        </div>
        <div class="col-2">
            <halved-row-slot left="Range" right="To Hit" />
        </div>
        <div class="col-2">Damage Roll</div>
        <div class="col-2">Type</div>
        <div class="col-2">Effect</div>
    </div>
    <div class="row" v-for="(move, index) in pokemon.moves" :key="index">
        <hr class="my-2"/>
        <added-move :move="move" :stats="pokemon.pokemonStats" />
    </div>
</template>

<script>
import { getAllPokemonItems, getPokemonItem, getSkillsFeature } from '../../../api/dex.api'
import AddedMove from '../../trainer/parts/AddedMove.vue'
import Passive from '../../trainer/parts/Passive.vue'
import HalvedRowSlot from '../../partials/HalvedRowSlot.vue'

export default {
    name: 'PokemonModalBody',
    props: {
        pokemon: {
            default: {}
        }
    },
    data(){
        return {
            hp: 0,
            catchRate: 0,
            selectedSkill: '',
            selectedItem: '',
            skillData: '',
            itemData: '',
            items: []
        }
    },
    components: {
        AddedMove,
        HalvedRowSlot,
        Passive
    },
    async beforeMount(){
        await getAllPokemonItems()
            .then(response => {
                this.items = response.data.results.map(item => item.name)
            })
        
        this.updateCatchRate();
    },
    methods: {
        async updateSkill(){
            await getSkillsFeature(this.selectedSkill)
                .then(response => {
                    this.skillData = response.data.effects
                })
        },
        async updateItem(){
            await getPokemonItem(this.selectedItem.replace("/", "_"))
                .then(response => {
                    this.itemData = response.data.effects
                })
        },
        updateCatchRate(){
            let modifier = -25
            if (this.hp < 0){
                modifier = 75
            }
            else if (this.hp < this.pokemon.pokemonStats.hp && this.hp < 10){
                modifier = 20
            }
            else if (this.hp < this.pokemon.pokemonStats.hp/2){
                modifier = 0
            }
            else if (this.hp >= this.pokemon.pokemonStats.hp/2 && this.hp < this.pokemon.pokemonStats.hp){
                modifier = -10
            }

            this.catchRate = this.pokemon.catchRate + modifier;
        }
    }
}
</script>
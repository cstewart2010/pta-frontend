<template>
    <div class="row my-2">
        <div class="col-md-8">
            <div class="row">
                <div class="col-md-5">
                    <div>Data</div>
                    <hr>
                    <div class="row">
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
                        <div class="input-group" v-if="isGM">
                            <div class="col-6">Switch form:</div>
                            <select class="form-select col-6" v-model="differentForm" @select="switchForm">
                                <option value=""></option>
                                <option v-for="(form, index) in pokemon.alternateForms" :key="index" :id="form" :value="form">
                                    {{form}}
                                </option>
                            </select>
                        </div>
                        <halved-row-slot left="Form" :right="pokemon.form" v-else />
                        <button class="btn btn-primary" v-if="isGM" @click="readyToEvolve">Ready for Evolution</button>
                        <evolve-pokemon :pokemon="pokemon" v-if="isGM" />
                        <halved-row-slot left="Proficiencies" :right="pokemon.proficiencies.join(', ')" />
                    </div>
                </div>
                <div class="col-md-5">
                    Modifiers
                    <hr>
                    <div class="row my-2">
                        <div class="col-md-4">
                            Current HP
                            <br>
                            <input class="w-75" type="number" :min="-pokemon.pokemonStats.hp" :max="pokemon.pokemonStats.hp" v-model="hp" @change="updateCatchRate" v-if="isGM">
                            <span>{{pokemon.currentHP}}</span>
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
                    <halved-row-slot left="Catch Rate" :right="catchRate" v-if="isGM"/>
                    <hr>
                    <div class="row" v-if="isGM">
                        <div>
                            <select class="form-select" v-model="selectedItem" @change="updateItem">
                                <option value=""></option>
                                <option v-for="(item, index) in items" :key="index" :id="item" :value="item">
                                    {{item}}
                                </option>
                            </select>
                        </div>
                        <div>
                            {{itemData}}
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    {{pokemon.nickname}}
                    <hr>
                    <img class="img-fluid" :src="url" :alt="pokemon.nickname">
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
                    <option value=""></option>
                    <option v-for="(skill, index) in pokemon.skills" :key="index" :id="skill" :value="skill">
                        {{skill}}
                    </option>
                </select>
                {{skillData}}
            </div>
        </div>
    </div>
    <hr/>
    <div class="row" v-if="isGM">
        <div class="col-12">
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
    <div class="row" v-if="isGM">
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
    <div v-if="isGM">
        <div class="row" v-for="(move, index) in pokemon.moves" :key="index">
            <hr class="my-2"/>
            <added-move :move="move" :stats="pokemon.pokemonStats" :user="pokemon.nickname" />
        </div>
    </div>
</template>

<script>
import { getAllPokemonItems, getPokemonItem, getSkillsFeature } from '../../api/dex.api'
import AddedMove from '../trainer/parts/AddedMove.vue'
import Passive from '../trainer/parts/Passive.vue'
import HalvedRowSlot from '../partials/HalvedRowSlot.vue'
import { changeForm, markAsEvolvable, updateHP } from '../../api/pokemon.api'
import { generateErrorModal } from '../../utils/modalUtil'
import { getCellParticipant, getIsGM, setPTAActivityToken } from '../../utils/localStorage'
import EvolvePokemon from '../modals/EvolvePokemon.vue'

export default {
    name: 'PokemonSheet',
    props: {
        pokemonId: {
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
            items: [],
            url: '',
            differentForm: '',
            isGM: getIsGM(),
            pokemon: {
                pokemonStats: {},
                eggGroups: []
            }
        }
    },
    components: {
        AddedMove,
        HalvedRowSlot,
        Passive,
        EvolvePokemon
    },
    async beforeMount(){
        this.pokemon = getCellParticipant(this.pokemonId);
        if (this.isGM){
            await getAllPokemonItems()
                .then(response => {
                    this.items = response.data.results.map(item => item.name)
                })
            this.hp = this.pokemon.currentHP;
            this.updateCatchRate();
        }
        if (this.pokemon.isShiny){
            this.url = `https://play.pokemonshowdown.com/sprites/ani-shiny/${this.pokemon.shinyPortrait}.gif`
        }
        else{
            this.url = `https://play.pokemonshowdown.com/sprites/ani/${this.pokemon.shinyPortrait}.gif`
        }
    },
    methods: {
        async updateSkill(){
            if (this.selectedSkill.length > 0){
                await getSkillsFeature(this.selectedSkill)
                    .then(response => {
                        this.skillData = response.data.effects
                    })
            }
            else {
                this.skillData = '';
            }
        },
        async updateItem(){
            if (this.selectedItem.length > 0){
                await getPokemonItem(this.selectedItem.replace("/", "_"))
                    .then(response => {
                        this.itemData = response.data.effects;
                    })
            }
            else {
                this.itemData = '';
            }
        },
        async switchForm(){
            if (this.differentForm.length > 0){
                console.log(this.differentForm)
                await changeForm(this.pokemon.pokemonId, this.differentForm.replace("/", "_"))
                    .then(response => {
                        setPTAActivityToken(response.headers['pta-activity-token']);
                        location.reload();
                    })
                    .catch(generateErrorModal);
            }
        },
        async updateCatchRate(){
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

            if (this.hp != this.pokemon.currentHp){
                await updateHP(this.pokemon.pokemonId, this.hp)
                    .catch(generateErrorModal);
            }

            this.catchRate = this.pokemon.catchRate + modifier;
        },
        async readyToEvolve(){
            if (this.isGM){
                await markAsEvolvable(this.pokemon.pokemonId)
                    .then(response => {
                        setPTAActivityToken(response.headers['pta-activity-token']);
                    })
                    .catch(generateErrorModal);
            }
        }
    }
}
</script>
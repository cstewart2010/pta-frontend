<template>
    <div>
        <h2>Game Control</h2>
        <div>Current game id: {{ gameId }} </div>
        <div>Current game master id: {{ gmId }} </div>
        <div class="row">
            <div class="col-md-6">
                <button @click="createGame">Create a new Game</button>
                <button @click="getGame">Get a Game's data</button>
                <button @click="deleteCreatedGame">Delete current game</button>
            </div>
            <div>
                <select>
                    <option v-for="(pokemon, index) in pokedex" v-bind:key="index" v-bind:id="pokemon.name" @click="getPokemonFromPokedex(pokemon.name)">
                    {{ pokemon.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNewGame, deleteGame, endGame, findGameById } from "../api/game.api";
    import { getAllPokemon, getPokemon } from '../api/pokedex.api';

    export default {
        name: "GameControl",
        data() {
            return {
                gameId: null,
                gmId: null,
                ptaActivityToken: null,
                ptaSessionAuth: null,
                pokedex: null
            }
        },
        mounted:function(){
                getAllPokemon().then(response => { this.pokedex = response.data.results; })
        },
        methods: {
            async createGame() {
                await this.deleteCreatedGame();
                const response = await createNewGame("test", "test", "test");
                if (response.status === 200){
                    this.gameId = response.data.gameId;
                    this.gmId = response.data.gameMaster.trainerId;
                    this.ptaActivityToken = response.headers['pta-activity-token']
                    this.ptaSessionAuth = response.headers['pta-session-auth']
                }
            },
            async getGame() {
                const response = await findGameById(this.gameId);
                alert(JSON.stringify(response));
            },
            async deleteCreatedGame(){
                if (this.gameId && this.gmId){
                    await endGame(this.gameId, this.gmId, this.ptaActivityToken, this.ptaSessionAuth);
                    await deleteGame(this.gameId, this.gmId, "test");

                    this.gameId = null;
                    this.gmId = null;
                }
            },
            async getPokemonFromPokedex(pokemon){
                await getPokemon(pokemon).then(reponse => {
                    alert(JSON.stringify(reponse.data));
                })
            }
        }
    }
</script>

<style scoped>
</style>
<template>
    <div>
        <h2>Game Control</h2>
        <div>Current game id: {{ gameId }} </div>
        <div class="row">
            <div class="col-md-6">
                <button @click="createGame">Create a new Game</button>
                <button @click="getGame">Get a Game's data</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNewGame, findGame } from "../api/game.api";

    export default {
        name: "GameControl",
        data() {
            return {
                gameId: "String"
            }
        },
        methods: {
            async createGame() {
                const [error, response] = await createNewGame()
                if (error){
                    alert(JSON.stringify(error));
                }
                else {
                    this.gameId = response.gameId
                    alert(this.gameId)
                }
            },
            async getGame() {
                const [error, response] = await findGame(this.gameId)
                if (error){
                    alert(error);
                }
                else {
                    alert(JSON.stringify(response))
                }
            }
        }
    }
</script>

<style scoped>
</style>
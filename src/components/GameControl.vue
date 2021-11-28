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
        </div>
    </div>
</template>

<script>
    import { createNewGame, deleteGame, endGame, findGameById } from "../api/game.api";

    export default {
        name: "GameControl",
        data() {
            return {
                gameId: null,
                gmId: null,
                ptaActivityToken: null,
                ptaSessionAuth: null
            }
        },
        methods: {
            async createGame() {
                await this.deleteCreatedGame();
                const response = await createNewGame("test", "test", "test")
                    .catch(error => {
                        alert(JSON.stringify(error));
                    });
                if (response.status === 200){
                    this.gameId = response.data.gameId;
                    this.gmId = response.data.gameMaster.trainerId;
                    this.ptaActivityToken = response.headers['pta-activity-token']
                    this.ptaSessionAuth = response.headers['pta-session-auth']
                }
            },
            async getGame() {
                const response = await findGameById(this.gameId)
                    .catch(error => {
                        alert(JSON.stringify(error));
                    });

                alert(JSON.stringify(response));
            },
            async deleteCreatedGame(){
                if (this.gameId && this.gmId){
                    await endGame(this.gameId, this.gmId, this.ptaActivityToken, this.ptaSessionAuth)
                    .catch(error => {
                        alert(JSON.stringify(error));
                    })
                    await deleteGame(this.gameId, this.gmId, "test")
                    .catch(error => {
                        alert(JSON.stringify(error));
                    });

                    this.gameId = null;
                    this.gmId = null;
                }
            }
        }
    }
</script>

<style scoped>
</style>
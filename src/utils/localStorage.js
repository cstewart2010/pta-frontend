const ACTIVITY_TOKEN = "ptaActivityToken";
const GAME_ID = "gameId";
const IS_AUTHENTICATE = "isAuthenticated";
const IS_GM = "isGM";
const SESSION_AUTH = "ptaSessionAuth";
const TRAINER = "trainer";
const TRAINERS = "trainers";
const TRAINER_ID = "trainerId";
const GAMEMASTER_ID = "gmId";
const MOVES = "moves"
const POKEMON_TEAM = "pokemonTeam"
const POKEMON_HOME = "pokemonHome"
const POKEMON_NEW_TEAM = "pokemonNewTeam"
const POKEMON_NEW_HOME = "pokemonNewHome"
const CURRENT_HP = "currentHP"

/**
 * Gets a logged in user's credentials
 * @returns the trainerId, activityToken, and sessionAuth (in that order) as an array
 */
export function getUserCredentials(){
    return [
        getIsGM() ? getGameMasterId() : getTrainerId(),
        getPTAActivityToken(),
        getSessionAuth() 
    ]
}

/**
 * @returns the user's activity token
 */
export function getPTAActivityToken(){
    return localStorage.getItem(ACTIVITY_TOKEN);
}

/**
 * @returns the user's gameId
 */
export function getGameId(){
    return localStorage.getItem(GAME_ID);
}

/**
 * @returns true if a user is signed in
 */
export function getIsAuthenticate(){
    return getParsedItem(IS_AUTHENTICATE);
}

/**
 * @returns true if the user is a gm
 */
export function getIsGM(){
    return getParsedItem(IS_GM);
}

/**
 * 
 * @param {String} npcId 
 * @returns the selected npc
 */
export function getNpc(npcId){
    return getParsedItem(npcId);
}

/**
 * @returns the user's sesstion auth
 */
export function getSessionAuth(){
    return localStorage.getItem(SESSION_AUTH);
}

/**
 * @returns the selected trainer
 */
export function getTrainer(){
    return getParsedItem(TRAINER);
}

/**
 * @returns all trainers for the gm
 */
export function getTrainers(){
    return getParsedItem(TRAINERS);
}

/**
 * @returns selected trainer moves
 */
export function getMoves(){
    return getParsedItem(MOVES);
}

/**
 * @returns current pokemon team
 */
export function getPokemonTeam(){
    return getParsedItem(POKEMON_TEAM);
}

/**
 * @returns current pokemon home
 */
export function getPokemonHome(){
    return getParsedItem(POKEMON_HOME);
}

/**
 * @returns new pokemon team
 */
export function getPokemonNewTeam(){
    return getParsedItem(POKEMON_NEW_TEAM);
}

/**
 * @returns new pokemon home
 */
export function getPokemonNewHome(){
    return getParsedItem(POKEMON_NEW_HOME);
}

/**
 * @returns the user's trainer Id
 */
export function getTrainerId(){
    return localStorage.getItem(TRAINER_ID);
}

/**
 * @returns the game master's gmId
 */
export function getGameMasterId(){
    return localStorage.getItem(GAMEMASTER_ID);
}

/**
 * @returns trainer's current hp
 */
export function getCurrentHP(){
    return getParsedItem(CURRENT_HP);
}

/**
 * @returns npc's current hp
 */
 export function getNpcHP(npcId){
    return getParsedItem(npcId+"hp");
}

/**
 * @returns cell participant
 */
export function getCellParticipant(id){
    return getParsedItem(id);
}

/**
 * Sets the users initial credentials on sign up or login
 * @param {String} trainerId the trainer's id
 * @param {import("axios").AxiosResponse<any,any>} response the response to build the initials credentials from
 * @param {Boolean} isGM whether the user is a game master
 */
export function setInitialCredentials(trainerId, response, isGM){
    if (isGM){
        setGameMasterId(trainerId);
    }
    else{
        setTrainerId(trainerId);
    }
    setPTAActivityToken(response.headers['pta-activity-token']);
    setSessionAuth(response.headers['pta-session-auth']);
    setIsAuthenticate(true);
    setGameId(response.gameId);
    setIsGM(isGM);
}

/**
 * Adds the user's activity token to local storage
 * @param {String} token 
 */
export function setPTAActivityToken(token){
    localStorage.setItem(ACTIVITY_TOKEN, token);
}

/**
 * Adds the user's gameId to local storage
 * @param {String} gameId 
 */
export function setGameId(gameId){
    localStorage.setItem(GAME_ID, gameId);
}

/**
 * Adds the user's authentication status to local storage
 * @param {Boolean} isAuthenticated 
 */
export function setIsAuthenticate(isAuthenticated){
    localStorage.setItem(IS_AUTHENTICATE, isAuthenticated);
}

/**
 * Adds the user's player status to local storage
 * @param {Boolean} isGM 
 */
export function setIsGM(isGM){
    localStorage.setItem(IS_GM, isGM);
}

/**
 * adds npc to local storage
 * @param {any} npc the current npc to set
 */
export function setNpc(npc){
    localStorage.setItem(npc.npcId, JSON.stringify(npc))
}

/**
 * Adds the user's session auth to local storage
 * @param {String} sessionAuth 
 */
export function setSessionAuth(sessionAuth){
    localStorage.setItem(SESSION_AUTH, sessionAuth);
}

/**
 * Adds the user's trainerId to local storage
 * @param {String} trainerId 
 */
export function setTrainerId(trainerId){
    localStorage.setItem(TRAINER_ID, trainerId);
}
/**
 * Adds the game master's gmId to local storage
 * @param {String} gmId 
 */
export function setGameMasterId(gmId){
    localStorage.setItem(GAMEMASTER_ID, gmId);
}

/**
 * Adds the current trainer to local storage
 * @param {any} trainer the current trainer to set
 */
export function setTrainer(trainer){
    localStorage.setItem(TRAINER, JSON.stringify(trainer));
}

/**
 * Adds the all of the trainers to local storage
 * @param {any[]} trainers all of the trainer in watch by the gm
 */
export function setTrainers(trainers){
    localStorage.setItem(TRAINERS, JSON.stringify(trainers));
}

/**
 * Adds the current trainer's moves to local storage
 * @param {any[]} moves the current trainer's moves
 */
export function setMoves(moves){
    localStorage.setItem(MOVES, JSON.stringify(moves));
}

/**
 * Adds the current trainer's team to local storage
 * @param {any[]} team the current trainer's team
 */
export function setPokemonTeam(team){
    localStorage.setItem(POKEMON_TEAM, JSON.stringify(team));
}

/**
 * Adds the current trainer's home to local storage
 * @param {any[]} home the current trainer's home
 */
export function setPokemonHome(home){
    localStorage.setItem(POKEMON_HOME, JSON.stringify(home));
}

/**
 * Adds the current trainer's new team to local storage
 * @param {any[]} team the current trainer's new team
 */
export function setPokemonNewTeam(team){
    localStorage.setItem(POKEMON_NEW_TEAM, JSON.stringify(team));
}

/**
 * Adds the current trainer's new home to local storage
 * @param {any[]} home the current trainer's new home
 */
export function setPokemonNewHome(home){
    localStorage.setItem(POKEMON_NEW_HOME, JSON.stringify(home));
}

/**
 * Adds the current trainer's hp to local storage
 * @param {Number} hp the current trainer's hp
 */
export function setCurrentHP(hp){
    localStorage.setItem(CURRENT_HP, JSON.stringify(hp));
}


/**
 * Adds the current npc's hp to local storage
 * @param {Number} hp the current npc's hp
 */
 export function setNpcHP(hp, npcId){
    localStorage.setItem(npcId+"hp", JSON.stringify(hp));
}

/**
 * Adds the cell participant to local storage
 * @param {Number} participant the cell participant
 */
export function setCellParticipant(id, participant){
    localStorage.setItem(id, JSON.stringify(participant));
}

/**
 * Removes trainer data from local storage
 */
export function removeTrainer(){
    localStorage.removeItem(TRAINER)
}

/**
 * Removes all pta data from local storage
 */
export function removeFromStorage(){
    localStorage.clear();
}

/**
 * Gets a json parsed item from local storage
 * @param {String} key the item to parse
 * @returns a jdon object
 */
const getParsedItem = key => JSON.parse(localStorage.getItem(key));
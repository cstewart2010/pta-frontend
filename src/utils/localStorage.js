const ACTIVITY_TOKEN = "ptaActivityToken";
const GAME_ID = "gameId";
const IS_AUTHENTICATE = "isAuthenticated";
const IS_GM = "isGM";
const SESSION_AUTH = "ptaSessionAuth";
const TRAINER = "trainer";
const USER = "user";
const USER_ID = "userId";
const TRAINERS = "trainers";
const TRAINER_ID = "trainerId";
const GAMEMASTER_ID = "gmId";
const MOVES = "moves"
const POKEMON_TEAM = "pokemonTeam"
const POKEMON_HOME = "pokemonHome"
const POKEMON_NEW_TEAM = "pokemonNewTeam"
const POKEMON_NEW_HOME = "pokemonNewHome"
const CURRENT_HP = "currentHP"
const IS_ADMIN = "isAdmin"
const DB_MOVES = "db_moves"
const DB_POKEDEX = "db_pokedex"
const DB_FULLPOKEDEX = "db_fullPokedex"
const DB_TRAINERCLASSES = "db_trainerclasses"
const DB_ORIGINS = "db_origins"
const DB_TRAINERITEMS = "db_trainerItems"
const DB_POKEMONITEMS = "db_pokemonItems"
const DB_POKEBALLS = "db_pokeballs"
const DB_MEDITEMS = "db_meditems"
const DB_KEYITEMS = "db_keyitems"
const DB_TRAINERITEMSFULL = "db_trainerItemsFull"
const DB_POKEMONITEMSFULL = "db_pokemonItemsFull"
const DB_POKEBALLSFULL = "db_pokeballsFull"
const DB_MEDITEMSFULL = "db_meditemsFull"
const DB_KEYITEMSFULL = "db_keyitemsFull"
const DB_BERRIES = "db_berries"
const DB_SPRITES = "db_sprites"
const DB_ACTUALTEAM = "db_actualTeam"
const DB_ACTUALHOME = "db_actualHome"
const DB_ENVIRONMENTS = "db_environments"

export function getActualTeam(){
    return JSON.parse(localStorage.getItem(DB_ACTUALTEAM));
}

export function getActualHome(){
    return JSON.parse(localStorage.getItem(DB_ACTUALHOME));
}

export function setActualTeam(team){
    localStorage.setItem(DB_ACTUALTEAM, JSON.stringify(team))
}

export function setActualHome(home){
    localStorage.setItem(DB_ACTUALHOME, JSON.stringify(home))
}

export function getDBMoves(){
    return JSON.parse(localStorage.getItem(DB_MOVES));
}

export function setDBMoves(moves){
    localStorage.setItem(DB_MOVES, JSON.stringify(moves))
}

export function getDBPokedex(){
    return JSON.parse(localStorage.getItem(DB_POKEDEX));
}

export function setDBPokedex(pokedex){
    localStorage.setItem(DB_POKEDEX, JSON.stringify(pokedex))
}

export function getDBFullPokedex(){
    return JSON.parse(localStorage.getItem(DB_FULLPOKEDEX));
}

export function setDBFullPokedex(pokedex){
    localStorage.setItem(DB_FULLPOKEDEX, JSON.stringify(pokedex))
}

export function getDBTrainerClasses(){
    return JSON.parse(localStorage.getItem(DB_TRAINERCLASSES));
}

export function setDBTrainerClasses(classes){
    localStorage.setItem(DB_TRAINERCLASSES, JSON.stringify(classes))
}

export function getDBOrigins(){
    return JSON.parse(localStorage.getItem(DB_ORIGINS));
}

export function setDBOrigins(origins){
    localStorage.setItem(DB_ORIGINS, JSON.stringify(origins))
}

export function getDBTrainerItems(){
    return JSON.parse(localStorage.getItem(DB_TRAINERITEMS));
}

export function setDBTrainerItems(items){
    localStorage.setItem(DB_TRAINERITEMS, JSON.stringify(items))
}

export function getDBPokemonItems(){
    return JSON.parse(localStorage.getItem(DB_POKEMONITEMS));
}

export function setDBPokemonItems(items){
    localStorage.setItem(DB_POKEMONITEMS, JSON.stringify(items))
}

export function getDBPokeballs(){
    return JSON.parse(localStorage.getItem(DB_POKEBALLS));
}

export function setDBPokeballs(items){
    localStorage.setItem(DB_POKEBALLS, JSON.stringify(items))
}

export function getDBMedItems(){
    return JSON.parse(localStorage.getItem(DB_MEDITEMS));
}

export function setDBMedItems(items){
    localStorage.setItem(DB_MEDITEMS, JSON.stringify(items))
}

export function getDBKeyItems(){
    return JSON.parse(localStorage.getItem(DB_KEYITEMS));
}

export function setDBKeyItems(items){
    localStorage.setItem(DB_KEYITEMS, JSON.stringify(items))
}

export function getDBTrainerItemsFull(){
    return JSON.parse(localStorage.getItem(DB_TRAINERITEMSFULL));
}

export function setDBTrainerItemsFull(items){
    localStorage.setItem(DB_TRAINERITEMSFULL, JSON.stringify(items))
}

export function getDBPokemonItemsFull(){
    return JSON.parse(localStorage.getItem(DB_POKEMONITEMSFULL));
}

export function setDBPokemonItemsFull(items){
    localStorage.setItem(DB_POKEMONITEMSFULL, JSON.stringify(items))
}

export function getDBPokeballsFull(){
    return JSON.parse(localStorage.getItem(DB_POKEBALLSFULL));
}

export function setDBPokeballsFull(items){
    localStorage.setItem(DB_POKEBALLSFULL, JSON.stringify(items))
}

export function getDBMedItemsFull(){
    return JSON.parse(localStorage.getItem(DB_MEDITEMSFULL));
}

export function setDBMedItemsFull(items){
    localStorage.setItem(DB_MEDITEMSFULL, JSON.stringify(items))
}

export function getDBKeyItemsFull(){
    return JSON.parse(localStorage.getItem(DB_KEYITEMSFULL));
}

export function setDBKeyItemsFull(items){
    localStorage.setItem(DB_KEYITEMSFULL, JSON.stringify(items))
}

export function getDBBerries(){
    return JSON.parse(localStorage.getItem(DB_BERRIES));
}

export function setDBBerries(items){
    localStorage.setItem(DB_BERRIES, JSON.stringify(items))
}

export function getDBSprites(){
    return JSON.parse(localStorage.getItem(DB_SPRITES));
}

export function setDBSprites(sprites){
    localStorage.setItem(DB_SPRITES, JSON.stringify(sprites))
}

export function getDBEnvironments(){
    return JSON.parse(localStorage.getItem(DB_ENVIRONMENTS));
}

export function setDBEnvironments(environments){
    localStorage.setItem(DB_ENVIRONMENTS, JSON.stringify(environments))
}

/**
 * Gets a logged in user's credentials
 * @returns the trainerId, activityToken, and sessionAuth (in that order) as an array
 */
export function getUserCredentials(){
    return [
        getUserId(),
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
    return getParsedItem(IS_GM) === true;
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
 * @returns the user's gmuserId
 */
export function getUserId(){
    return localStorage.getItem(USER_ID);
}

/**
 * @returns trainer's current hp
 */
export function getCurrentHP(){
    return getParsedItem(CURRENT_HP);
}

/**
 * @returns the user data
 */
export function getUser(){
    return getParsedItem(USER)
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

export function getIsAdmin(){
    return getParsedItem(IS_ADMIN)
}

/**
 * Sets the users initial credentials on sign up or login
 * @param {any} user the user data
 * @param {import("axios").AxiosResponseHeaders} headers the response to build the initials credentials from
 * @param {Boolean} isGM whether the user is a game master
 */
export function setInitialCredentials(user, headers){
    setUser(user);
    setUserId(user.userId);
    setPTAActivityToken(headers['pta-activity-token']);
    setSessionAuth(headers['pta-session-auth']);
    setIsAuthenticate(true);
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
 * Adds the user's userId to local storage
 * @param {String} userId 
 */
export function setUserId(userId){
    localStorage.setItem(USER_ID, userId);
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
 * Adds the current user to local storage
 * @param {any} user the current user to set
 */
export function setUser(user){
    localStorage.setItem(USER, JSON.stringify(user));
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

export function setIsAdmin(isAdmin){
    localStorage.setItem(IS_ADMIN, JSON.stringify(isAdmin));
}

export function removeGameId(){
    localStorage.removeItem(GAME_ID);
}

/**
 * Removes trainer data from local storage
 */
export function removeTrainer(){
    localStorage.removeItem(TRAINER)
}

export function removeTrainers(){
    localStorage.removeItem(TRAINERS);
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
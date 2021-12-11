const ACTIVITY_TOKEN = "ptaActivityToken";
const GAME_ID = "gameId";
const IS_AUTHENTICATE = "isAuthenticated";
const IS_GM = "isGM";
const SESSION_AUTH = "ptaSessionAuth";
const TRAINER = "trainer";
const TRAINERS = "trainers";
const TRAINER_ID = "trainerId";

/**
 * Gets a logged in user's credentials
 * @returns the trainerId, activityToken, and sessionAuth (in that order) as an array
 */
export function getUserCredentials(){
    return [
        getTrainerId(),
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
 * @returns the user's sesstion auth
 */
export function getSessionAuth(){
    return localStorage.getItem(SESSION_AUTH);
}

export function getTrainer(){
    return getParsedItem(TRAINER);
}

export function getTrainers(){
    return getParsedItem(TRAINERS);
}

/**
 * @returns the user's trainer Id
 */
export function getTrainerId(){
    return localStorage.getItem(TRAINER_ID);
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

export function setTrainer(trainer){
    localStorage.setItem(TRAINER, JSON.stringify(trainer));
}

export function setTrainers(trainers){
    localStorage.setItem(TRAINERS, JSON.stringify(trainers));
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
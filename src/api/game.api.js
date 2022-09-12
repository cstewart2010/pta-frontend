import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
import { getPokemon } from './dex.api';
import { getGameId, getUserCredentials, getUserId } from '../utils/localStorage';
const GAME_RESOURCE = `${BASE_URL}/api/v1/game`

/**
 * @returns The last 20 game sessions generated
 */
export async function findAllGames() {
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    return await requestHandler(`${GAME_RESOURCE}/user/${userId}`, METHODS.GET, {activityToken, sessionAuth});
}

export async function findAllUserGames(){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    return await requestHandler(`${GAME_RESOURCE}/user/games/${userId}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * @returns Sprites to be used for Trainer portraits
 */
export async function getAllSprites(){
    return await requestHandler(`${GAME_RESOURCE}/sprites/all`, METHODS.GET);
}

/**
 * @param {String} nickname the session nickname to limit the query by
 * @returns All game sessions matching the nickname
 */
export async function findAllGamesByNickname(nickname) {
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(nickname, 'nickname');

    return await requestHandler(`${GAME_RESOURCE}/user/${userId}?nickname=${nickname}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Searches for a game session using its id
 * @param {String} gameId the session id to search with
 * @returns Returns the game session the matches the gameId
 */
export async function findGameById(gameId) {
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${GAME_RESOURCE}/getGame/${gameId}`, METHODS.GET)
}

/**
 * Searches for a trainer using their id
 * @param {String} gameId the session id to search with
 * @param {String} trainerId the trainer id to search with
 * @returns 
 */
export async function findTrainerInGame(gameId, trainerId) {
    nullChecker(gameId, 'gameId');
    nullChecker(trainerId, 'trainerId');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/${trainerId}/find`, METHODS.GET);
}

/**
 * Searches for a trainer using their id
 * @param {String} gameId the session id to search with
 * @returns 
 */
export async function getAllLogs(gameId){
    nullChecker(gameId, 'gameId');
    
    return await requestHandler(`${GAME_RESOURCE}/${gameId}/all_logs`, METHODS.GET);
}

/**
 * Searches for a trainer using their id
 * @param {String} gameId the session id to search with
 * @returns 
 */
export async function getLogs(gameId){
    nullChecker(gameId, 'gameId');
    
    return await requestHandler(`${GAME_RESOURCE}/${gameId}/logs`, METHODS.GET);
}

/**
 * Creates a new game session and assigns it to a new game master
 * @param {String} username the username for the game session's game master
 * @param {String} userId the game master's user id
 * @param {String} gameSessionPassword the game session's password
 * @param {String} nickname the game nickname, if the game master wishes to set one
 * @returns the Game data
 */
export async function createNewGame(username, userId, gameSessionPassword, nickname = null){
    nullChecker(username, 'username');
    nullChecker(userId, 'userId');
    nullChecker(gameSessionPassword, 'gameSessionPassword');

    let endpoint = `${GAME_RESOURCE}/${userId}/newGame?gameSessionPassword=${gameSessionPassword}&username=${username}`;
    if (nickname){
        endpoint = `${endpoint}&nickname=${nickname}`;
    }
    
    return await requestHandler(endpoint, METHODS.POST);
}

/**
 * Imports a game session for a json file
 * @param {any} importFile the json file to send to the server
 * @returns A 200 status code if successful
 */
export async function importGame(importFile){
    nullChecker(importFile, 'importFile');
    const data = new FormData();
    data.append("json", importFile);

    return await requestHandler(`${GAME_RESOURCE}/import`, METHODS.POST, {data, contentType: 'multipart/form-data'});
}

/**
 * Generates a wild pokemon and assigns it to the game master
 * @param {String} pokemon the pokemon's name in the pokedex
 * @param {String} nature the pokemon's nature
 * @param {String} gender the pokemon's gender
 * @param {String} status the pokemon's status
 * @param {String} nickname the pokemon's nickname
 * @returns 
 */
export async function createWildPokemon(pokemon, nature, gender, status, nickname){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(pokemon, 'pokemon');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    natureChecker(nature);
    genderChecker(gender);
    statusChecker(status);
    await getPokemon(pokemon)
        .catch(() => {
                throw `Invalid pokemon ${pokemon}`
            })


    const data = {
        pokemon,
        nature,
        gender,
        status,
        nickname
    }
    return await requestHandler(`${GAME_RESOURCE}/${gameMasterId}/wild`, METHODS.POST, {activityToken, sessionAuth, data});
}

/**
 * Add a new player to an extant game session
 * @param {String} gameId the session id to search with
 * @param {String} username the trainer's username
 * @param {String} userId the game master's user id
 * @returns the trainer data
 */
export async function addPlayerToGame(gameId, username, userId){
    nullChecker(gameId, 'gameId');
    nullChecker(username, 'username');
    nullChecker(userId, 'userId');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/${userId}/newUser?username=${username}`, METHODS.POST);
}

export async function postLog(log){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(trainerId, 'trainerId');
    nullChecker(log, 'log');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}/${trainerId}/log`
    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth, data: log});
}

export async function allowUser(gameId, trainerId){
    nullChecker(gameId, 'gameId');
    nullChecker(trainerId, 'trainerId');
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();

    const endpoint = `${GAME_RESOURCE}/${gameId}/${gameMasterId}/${trainerId}/allow`
    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth});
}

export async function disallowUser(gameId, trainerId){
    nullChecker(gameId, 'gameId');
    nullChecker(trainerId, 'trainerId');
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();

    const endpoint = `${GAME_RESOURCE}/${gameId}/${gameMasterId}/${trainerId}/disallow`
    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth});
}

/**
 * Adds changes to trainer to the database
 * @param {any} trainer the partial updated trainer data
 * @returns the completed updated trainer data
 */
export async function completeTrainer(trainer){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(trainer, 'trainer');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}/${trainerId}/addStats`
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth, data: trainer});
}

/**
 * Sets a game sessions status to Online
 * @param {String} gameId the session id to search with
 * @param {String} gmUsername the username for the game session's game master
 * @param {String} gmPassword the game master's password
 * @param {String} gameSessionPassword the game session's password
 * @returns A 200 status code if successful
 */
export async function startGame(gameId, gmUsername, gmPassword, gameSessionPassword){
    nullChecker(gameId, 'gameId');
    nullChecker(gmUsername, 'gmUsername');
    nullChecker(gmPassword, 'gmPassword');
    nullChecker(gameSessionPassword, 'gameSessionPassword');

    const data = {
        gmUsername,
        gmPassword,
        gameSessionPassword
    }

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/start`, METHODS.PUT, {data});
}

/**
 * Sets a game sessions status to Offline
 * @returns A 200 status code if successful
 */
export async function endGame(){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(gameId, 'gameId');
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/end?gameMasterId=${gameMasterId}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Adds a set of npcs to a game session using the npcs' ids
 * @param {String} npcList the npcs to add to the game
 * @returns A 200 status code if successful
 */
export async function addNpcs(npcList){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(gameId, 'gameId');
    nullChecker(npcList, 'npcList');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/${gameMasterId}/addNpcs`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Removes a set of npcs to a game session using the npcs' ids
 * @param {String} npcList the npcs to remove from the game
 * @returns A 200 status code if successful
 */
export async function removeNpcs(npcList){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(gameId, 'gameId');
    nullChecker(npcList, 'npcList');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/${gameMasterId}/removeNpcs?npcList=${npcList}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Resets a trainer password
 * @param {String} trainerId the trainer id to search with
 * @param {String} password the trainer's password
 * @returns A 200 status code if successful
 */
export async function resetPassword(trainerId, password){
    nullChecker(trainerId, 'trainerId');
    nullChecker(password, 'password');

    return await requestHandler(`${GAME_RESOURCE}/reset?trainerId=${trainerId}&password=${password}`, METHODS.PUT);
}

/**
 * Export the game session from the server and deletes it
 * @param {String} gameSessionPassword the game session's password
 * @returns A json file matching the exported game
 */
export async function exportGame(gameSessionPassword){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(gameId, 'gameId');
    nullChecker(gameSessionPassword, 'gameSessionPassword');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}/${gameMasterId}/export?gameSessionPassword=${gameSessionPassword}`;
    return await requestHandler(endpoint, METHODS.DELETE, {activityToken, sessionAuth});
}

/**
 * Delete the game session from the server
 * @param {String} gameSessionPassword the game session's password
 * @returns A 200 status code if successful
 */
export async function deleteGame(gameSessionPassword){
    const gameId = getGameId();
    const gameMasterId = getUserId()
    nullChecker(gameId, 'gameId');
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(gameSessionPassword, 'gameSessionPassword');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}/${gameMasterId}?gameSessionPassword=${gameSessionPassword}`;
    return await requestHandler(endpoint, METHODS.DELETE);
}
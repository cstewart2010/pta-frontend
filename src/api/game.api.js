import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
import { getPokemon } from './pokedex.api';
const GAME_RESOURCE = `${BASE_URL}/api/v1/game`

/**
 * @returns The last 20 game sessions generated
 */
export async function findAllGames() {
    return await requestHandler(GAME_RESOURCE, METHODS.GET);
}

/**
 * @param {String} nickname the session nickname to limit the query by
 * @returns All game sessions matching the nickname
 */
export async function findAllGamesByNickname(nickname) {
    nullChecker(nickname, 'nickname');

    return await requestHandler(`${GAME_RESOURCE}?nickname=${nickname}`, METHODS.GET);
}

/**
 * Searches for a game session using its id
 * @param {String} gameId the session id to search with
 * @returns Returns the game session the matches the gameId
 */
export async function findGameById(gameId) {
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}`, METHODS.GET)
}

/**
 * Searches for a trainer using their id
 * @param {String} gameId the session id to search with
 * @param {String} trainerId 
 * @returns 
 */
export async function findTrainerInGame(gameId, trainerId) {
    nullChecker(gameId, 'gameId');
    nullChecker(trainerId, 'trainerId');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/find/${trainerId}`, METHODS.GET);
}

/**
 * Creates a new game session and assigns it to a new game master
 * @param {String} gmUsername the username for the game session's game master
 * @param {String} gmPassword the game master's password
 * @param {String} gameSessionPassword the game session's password
 * @param {String} nickname the game nickname, if the game master wishes to set one
 * @returns the Game data
 */
export async function createNewGame(gmUsername, gmPassword, gameSessionPassword, nickname = null){
    nullChecker(gmUsername, 'gmUsername');
    nullChecker(gmPassword, 'gmPassword');
    nullChecker(gameSessionPassword, 'gameSessionPassword');

    let endpoint = `${GAME_RESOURCE}/new?gmUsername=${gmUsername}&gmPassword=${gmPassword}&gameSessionPassword=${gameSessionPassword}`;
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
 * @param {String} gameMasterId the game master's id
 * @param {String} pokemon the pokemon's name in the pokedex
 * @param {String} nature the pokemon's nature
 * @param {String} gender the pokemon's gender
 * @param {String} status the pokemon's status
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @param {String} nickname the pokemon's nickname
 * @returns 
 */
export async function createWildPokemon(gameMasterId, pokemon, nature, gender, status, activityToken, sessionAuth, nickname){
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(pokemon, 'pokemon');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    natureChecker(nature);
    genderChecker(gender);
    statusChecker(status);
    await getPokemon(pokemon)
        .then(response => {
            if (response.status != 200){
                throw `Invalid pokemon ${pokemon}`
            }
        })

    let endpoint = `${GAME_RESOURCE}/${gameMasterId}/wild?pokemon=${pokemon}&nature=${nature}&gender=${gender}&status=${status}`;    
    if (nickname){
        endpoint = `${endpoint}&nickname=${nickname}`
    }

    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth})
}

/**
 * Add a new player to an extant game session
 * @param {String} gameId the session id to search with
 * @param {String} username the trainer's username
 * @param {String} password the trainer's password
 * @param {Number} attack the trainer's attack stat
 * @param {Number} defense the trainer's defense stat
 * @param {Number} specialAttack the trainer's special attack stat
 * @param {Number} specialDefense the trainer's special defense stat
 * @param {Number} speed the trainer's speed stat
 * @returns the trainer data
 */
export async function addPlayerToGame(gameId, username, password){
    nullChecker(gameId, 'gameId');
    nullChecker(username, 'username');
    nullChecker(password, 'password');

    const endpoint = `${GAME_RESOURCE}/${gameId}/new?username=${username}&password=${password}`
    return await requestHandler(endpoint, METHODS.POST);
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

    const endpoint = `${GAME_RESOURCE}/${gameId}/start?gmUsername=${gmUsername}&gmPassword=${gmPassword}&gameSessionPassword=${gameSessionPassword}`;
    return await requestHandler(endpoint, METHODS.PUT);
}

/**
 * Sets a game sessions status to Offline
 * @param {String} gameId the session id to search with
 * @param {String} gameMasterId the game master's id
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns A 200 status code if successful
 */
export async function endGame(gameId, gameMasterId, activityToken, sessionAuth){
    nullChecker(gameId, 'gameId');
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/end?gameMasterId=${gameMasterId}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Adds a set of npcs to a game session using the npcs' ids
 * @param {String} gameId the session id to search with
 * @param {String} npcList the npcs to add to the game
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns A 200 status code if successful
 */
export async function addNpcs(gameId, npcList, activityToken, sessionAuth){
    nullChecker(gameId, 'gameId');
    nullChecker(npcList, 'npcList');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/addNpcs?npcList=${npcList}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Removes a set of npcs to a game session using the npcs' ids
 * @param {String} gameId the session id to search with
 * @param {String} npcList the npcs to remove from the game
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns A 200 status code if successful
 */
export async function removeNpcs(gameId, npcList, activityToken, sessionAuth){
    nullChecker(gameId, 'gameId');
    nullChecker(npcList, 'npcList');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${GAME_RESOURCE}/${gameId}/removeNpcs?npcList=${npcList}`, METHODS.PUT, {activityToken, sessionAuth});
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
 * @param {String} gameId the session id to search with
 * @param {String} gameMasterId the game master's id
 * @param {String} gameSessionPassword the game session's password
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns A json file matching the exported game
 */
export async function exportGame(gameId, gameMasterId, gameSessionPassword, activityToken, sessionAuth){
    nullChecker(gameId, 'gameId');
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(gameSessionPassword, 'gameSessionPassword');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}/export?gameMasterId=${gameMasterId}&gameSessionPassword=${gameSessionPassword}`;
    return await requestHandler(endpoint, METHODS.DELETE, {activityToken, sessionAuth});
}

/**
 * Delete the game session from the server
 * @param {String} gameId the session id to search with
 * @param {String} gameMasterId the game master's id
 * @param {String} gameSessionPassword the game session's password
 * @returns A 200 status code if successful
 */
export async function deleteGame(gameId, gameMasterId, gameSessionPassword){
    nullChecker(gameId, 'gameId');
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(gameSessionPassword, 'gameSessionPassword');
    
    const endpoint = `${GAME_RESOURCE}/${gameId}?gameMasterId=${gameMasterId}&gameSessionPassword=${gameSessionPassword}`;
    return await requestHandler(endpoint, METHODS.DELETE);
}
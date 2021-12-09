import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
import { getPokemon } from './pokedex.api';
const TRAINER_RESOURCE = `${BASE_URL}/api/v1/trainer`

/**
 * Queries the Pokemon collection using the id
 * @param {String} trainerId The trainer's UUID
 * @param {String} pokemonId The Pokemon's UUID
 * @returns a Pokemon
 */
export async function getTrainerMon(trainerId, pokemonId){
    nullChecker(trainerId, 'trainerId');
    nullChecker(pokemonId, 'pokemonId');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/${pokemonId}`, METHODS.GET);
}

/**
 * Adds a new pokemon to a trainer's catalog
 * @param {String} trainerId The trainer's UUID
 * @param {String} gmId The game master's UUID
 * @param {String} pokemon the pokemon's name in the pokedex
 * @param {String} nature the pokemon's nature
 * @param {String} gender the pokemon's gender
 * @param {String} status the pokemon's status
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @param {String} nickname the pokemon's nickname
 * @returns a Pokemon
 */
export async function addPokemon(trainerId, gmId, pokemon, nature, gender, status, activityToken, sessionAuth, nickname){
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
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

    let endpoint = `${TRAINER_RESOURCE}/${trainerId}?pokemon=${pokemon}&nature=${nature}&gender=${gender}&status=${status}&gameMaster=${gmId}`;    
    if (nickname){
        endpoint = `${endpoint}&nickname=${nickname}`;
    }

    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth});
}

/**
 * Assigns a trainer's IsOnline status to true
 * @param {String} gameId The game session's UUID
 * @param {String} username The trainer's username
 * @param {String} password The trainer's password
 * @returns the trainer and their tokens
 */
export async function userLogin(gameId, username, password){
    nullChecker(gameId, 'gameId');
    nullChecker(username, 'username');
    nullChecker(password, 'password');

    return await requestHandler(`${TRAINER_RESOURCE}/login?gameId=${gameId}&username=${username}&password=${password}`, METHODS.PUT);
}

/**
 * Assigns a trainer's IsOnline status to true
 * @param {String} trainerId The trainer's UUID
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns the trainer and their tokens
 */
export async function userLogout(trainerId, activityToken, sessionAuth){
    nullChecker(trainerId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/logout`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * 
 * @param {String} trainerId The trainer's UUID
 * @param {String} gmId The game master's UUID
 * @param {any} itemPairs The key/value pairs for the items
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 */
export async function addItems(trainerId, gmId, itemPairs, activityToken, sessionAuth){
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/addItems?gameMaster=${gmId}&${getGroceries(itemPairs)}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * 
 * @param {String} trainerId The trainer's UUID
 * @param {any} itemPairs The key/value pairs for the items
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 */
export async function removeItems(trainerId, itemPairs, activityToken, sessionAuth){
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/removeItems?${getGroceries(itemPairs)}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} trainerId The trainer's UUID
 * @param {String} gmId The game master's UUID
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns A generic message
 */
export async function deletePokemon(trainerId, gmId, activityToken, sessionAuth){
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}?gameMasterId=${gmId}`, METHODS.DELETE, {activityToken, sessionAuth});
}


const getGroceries = (itemPairs) => {
    let groceries = [];
    for (const itemPair in itemPairs){
        groceries.push(`${itemPair}=${itemPairs[itemPair]}`);
    }

    return groceries.join('&')
}
import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
import { getPokemon } from './dex.api';
import { getGameId, getUserCredentials } from '../utils/localStorage';
const TRAINER_RESOURCE = `${BASE_URL}/api/v1/trainer`

/**
 * Refreshes the game master's tokens
 * @returns a game master
 */
export async function refreshGM(){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    const gameId = getGameId();
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${TRAINER_RESOURCE}/refreshGM?gameMasterId=${gmId}&gameId=${gameId}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Refreshes the trainer's tokens
 * @returns the trainer
 */
export async function refreshTrainer(){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/refreshTrainer?trainerId=${trainerId}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Queries the database for all trainers in a game using the game id
 * @param {String} gameId The game session's UUID
 * @returns all trainers in the game
 */
export async function getTrainers(gameId){
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${TRAINER_RESOURCE}/trainers?gameId=${gameId}`, METHODS.GET);
}

/**
 * Queries the database for the trainer in a game using the username
 * @param {String} gameId The game session's UUID
 * @param {String} username The trainer's username
 * @returns the trainer matching the name
 */
export async function getTrainer(gameId,username){
    nullChecker(gameId, 'gameId');
    nullChecker(username, 'username');

    return await requestHandler(`${TRAINER_RESOURCE}/trainers?gameId=${gameId}&trainerName=${username}`, METHODS.GET);
}

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
 * @param {String} pokemon the pokemon's name in the pokedex
 * @param {String} nature the pokemon's nature
 * @param {String} gender the pokemon's gender
 * @param {String} status the pokemon's status
 * @param {String} nickname the pokemon's nickname
 * @returns a Pokemon
 */
export async function addPokemon(trainerId, pokemon, nature, gender, status, nickname){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
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

    return await requestHandler(`${TRAINER_RESOURCE}/login?gameId=${gameId}&trainerName=${username}&password=${password}`, METHODS.PUT);
}

/**
 * Assigns a trainer's IsOnline status to false
 * @returns the trainer and their tokens
 */
export async function userLogout(){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/logout`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Add items to a trainer's bag
 * @param {String} trainerId The trainer's UUID
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function addItems(trainerId, itemPairs){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/addItems?gameMaster=${gmId}&${getGroceries(itemPairs)}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Removes items from a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function removeItems(itemPairs){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/removeItems?${getGroceries(itemPairs)}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} trainerId The trainer's UUID
 * @returns A generic message
 */
export async function deletePokemon(trainerId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
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
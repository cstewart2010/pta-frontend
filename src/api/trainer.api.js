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

    let endpoint = `${TRAINER_RESOURCE}/${trainerId}?gameMaster=${gmId}`;    
    if (nickname){
        endpoint = `${endpoint}&nickname=${nickname}`;
    }

    const data = {
        pokemon,
        nature,
        gender,
        status
    }

    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth, data});
}

/**
 * Assigns a trainer's IsOnline status to true
 * @param {String} gameId The game session's UUID
 * @param {String} trainerName The trainer's username
 * @param {String} password The trainer's password
 * @returns the trainer and their tokens
 */
export async function userLogin(gameId, trainerName, password){
    nullChecker(gameId, 'gameId');
    nullChecker(trainerName, 'trainerName');
    nullChecker(password, 'password');

    const data = {
        trainerName,
        password,
    }

    return await requestHandler(`${TRAINER_RESOURCE}/login?gameId=${gameId}`, METHODS.PUT, {data});
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
 * Adds a new honor to the party
 * @param {string} honor the honor to add
 */
export async function addGroupHonor(honor){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(honor, 'honor');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gmId}/groupHonor`, METHODS.PUT, {activityToken, sessionAuth, data: {honor}});
}

/**
 * Adds a new honor to a single trainer
 * @param {string} honor the honor to add
 * @param {string} trainerId The trainer to grant the honor to
 */
export async function addHonor(honor, trainerId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(honor, 'honor');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gmId}/honor`, METHODS.PUT, {activityToken, sessionAuth, data: {honor, trainerId}});
}

/**
 * Add items to a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function addItems(itemPairs){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/addItems`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
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

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}/removeItems`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} trainerId The trainer's UUID
 * @returns A generic message
 */
export async function deleteTrainer(trainerId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${trainerId}?gameMasterId=${gmId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
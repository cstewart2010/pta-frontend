import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
import { getPokemon } from './dex.api';
import { getGameId, getTrainerId, getUserCredentials } from '../utils/localStorage';
const TRAINER_RESOURCE = `${BASE_URL}/api/v1/trainer`

/**
 * Queries the database for all trainers in a game using the game id
 * @param {String} gameId The game session's UUID
 * @returns all trainers in the game
 */
export async function getTrainers(gameId){
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/trainers`, METHODS.GET);
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

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/trainers?trainerName=${username}`, METHODS.GET);
}

/**
 * Queries the Pokemon collection using the id
 * @param {String} trainerId The trainer's UUID
 * @param {String} pokemonId The Pokemon's UUID
 * @returns a Pokemon
 */
export async function getTrainerMon(trainerId, pokemonId){
    const gameId = getGameId();
    nullChecker(trainerId, 'trainerId');
    nullChecker(pokemonId, 'pokemonId');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${trainerId}/${pokemonId}`, METHODS.GET);
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
export async function addPokemon(trainerId, pokemon, nature, gender, status, nickname = null){
    const gameId = getGameId();
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

    let endpoint = `${TRAINER_RESOURCE}/${gameId}/${gmId}/${trainerId}`;

    const data = {
        pokemon,
        nature,
        gender,
        status,
        nickname
    }

    return await requestHandler(endpoint, METHODS.POST, {activityToken, sessionAuth, data});
}

/**
 * Adds a new honor to the party
 * @param {string} honor the honor to add
 */
export async function addGroupHonor(honor){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(honor, 'honor');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gmId}/groupHonor`, METHODS.PUT, {activityToken, sessionAuth, data: {honor}});
}

/**
 * Adds a new honor to a single trainer
 * @param {string} honor the honor to add
 * @param {string} trainerId The trainer to grant the honor to
 */
export async function addHonor(honor, trainerId){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(honor, 'honor');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gmId}/honor`, METHODS.PUT, {activityToken, sessionAuth, data: {honor, trainerId}});
}

/**
 * Add items to a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function addItems(itemPairs){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const trainerId = getTrainerId();
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/${trainerId}/addItems`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

/**
 * Add items to a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function addItemsAll(itemPairs){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/addItems/all`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

/**
 * Removes items from a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function removeItems(itemPairs){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${trainerId}/removeItems`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

/**
 * Add items to a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function removeItemsGm(itemPairs){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    const trainerId = getTrainerId();
    nullChecker(trainerId, 'trainerId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/${trainerId}/removeItems`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

/**
 * Removes items from a trainer's bag
 * @param {any} itemPairs The key/value pairs for the items
 */
export async function removeItemsAll(itemPairs){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(itemPairs, 'itemPairs');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/removeItems/all`, METHODS.PUT, {activityToken, data: itemPairs, sessionAuth});
}

export async function updateMoney(trainerId, addition){
    
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(addition, 'addition');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/${trainerId}/money?addition=${addition}`, METHODS.PUT, {activityToken, sessionAuth});
}

export async function updateMoneyAll(addition){
    
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(addition, 'addition');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gameMasterId}/money/all?addition=${addition}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} trainerId The trainer's UUID
 * @returns A generic message
 */
export async function deleteTrainer(trainerId){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${TRAINER_RESOURCE}/${gameId}/${gmId}/${trainerId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
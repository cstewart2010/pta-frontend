import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getGameId, getUserCredentials } from '../utils/localStorage';
const POKEMON_RESOURCE = `${BASE_URL}/api/v1/pokemon`

/**
 * Queries the Pokemon collection using the id
 * @param {String} pokemonId The Pokemon's UUID
 * @returns a Pokemon
 */
export async function getGamePokemon(pokemonId){
    nullChecker(pokemonId, 'pokemonId');

    return await requestHandler(`${POKEMON_RESOURCE}/${pokemonId}`, METHODS.GET);
}

/**
 * Trades two users pokemon
 * @param {String} leftPokemonId The left trainer's Pokemon UUID
 * @param {String} rightPokemonId The right trainer's Pokemon UUID
 * @returns the updated Pokemon
 */
export async function tradePokemon(leftPokemonId, rightPokemonId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(leftPokemonId, 'leftPokemonId');
    nullChecker(rightPokemonId, 'rightPokemonId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/trade?gameMasterId=${gmId}&leftPokemonId=${leftPokemonId}&rightPokemonId=${rightPokemonId}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Updates a pokemon's current hp
 * @param {String} pokemonId The pokemon's id
 * @param {int} hp The updated hp
 */
export async function updateHP(pokemonId, hp){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(hp, 'hp');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/hp/${hp}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Change a pokemon to an alternate form
 * @param {String} pokemonId The pokemon's id
 * @param {String} form The different form
 * @returns the update Pokemon
 */
export async function changeForm(pokemonId, form){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(form, 'form');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/form/${form}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Mark a pokemon as evolvable
 * @param {String} pokemonId The Pokemon's UUID
 */
export async function markAsEvolvable(pokemonId){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(gmId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${gmId}/${pokemonId}/canEvolve`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Gets a pokemon's possible evolutions
 * @param {String} pokemonId The Pokemon's UUID
 * @returns all possible evolutions
 */
export async function getPossibleEvolutions(pokemonId){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/possibleEvolutions`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Evolves a pokemon to its next Form
 * @param {String} pokemonId The Pokemon's UUID
 * @param {String} nextForm The Pokemon's evolved form
 * @param {String[]} keptMoves The Pokemon's moves to keep
 * @param {String[]} newMoves The Pokemon's moves to learn
 * @returns the updated Pokemon
 */
export async function evolvePokemon(pokemonId, nextForm, keptMoves, newMoves){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(nextForm, 'nextForm');
    nullChecker(keptMoves, 'keptMoves');
    nullChecker(newMoves, 'newMoves');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const data = {
        nextForm,
        keptMoves,
        newMoves
    }

    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/evolve`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates a 
 * @param {String} trainerId The trainer's UUID
 * @param {Number} dexNo 
 * @returns 
 */
export async function seePokemon(trainerId, dexNo){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(dexNo, 'dexNo');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${gameId}/${gmId}/${trainerId}/saw?dexNo=${dexNo}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} pokemonId The Pokemon's UUID
 * @returns A generic message
 */
export async function deletePokemon(pokemonId){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${POKEMON_RESOURCE}/${gameId}/${gmId}/${pokemonId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
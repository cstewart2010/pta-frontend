import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getUserCredentials } from '../utils/localStorage';
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
 * Change a pokemon to an alternate form
 * @param {String} pokemonId The pokemon's id
 * @param {String} form The different form
 * @returns the update Pokemon
 */
export async function changeForm(pokemonId, form){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(form, 'form');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${pokemonId}/form/${form}?trainerId=${trainerId}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Mark a pokemon as evolvable
 * @param {String} pokemonId The Pokemon's UUID
 */
export async function markAsEvolvable(pokemonId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(gmId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${POKEMON_RESOURCE}/${gmId}/canEvolve/${pokemonId}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Gets a pokemon's possible evolutions
 * @param {String} pokemonId The Pokemon's UUID
 * @returns all possible evolutions
 */
export async function getPossibleEvolutions(pokemonId){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const endpoint = `${POKEMON_RESOURCE}/${trainerId}/possibleEvolutions/${pokemonId}`;
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

    const endpoint = `${POKEMON_RESOURCE}/${trainerId}/evolve/${pokemonId}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates a 
 * @param {String} trainerId The trainer's UUID
 * @param {Number} dexNo 
 * @returns 
 */
export async function seePokemon(trainerId, dexNo){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(dexNo, 'dexNo');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${trainerId}/saw?gameMasterId=${gmId}&dexNo=${dexNo}`;
    return await requestHandler(endpoint, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes a pokemon from the database
 * @param {String} pokemonId The Pokemon's UUID
 * @returns A generic message
 */
export async function deletePokemon(pokemonId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${POKEMON_RESOURCE}/${pokemonId}?gameMasterId=${gmId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
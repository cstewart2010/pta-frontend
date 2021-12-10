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
 * Evolves a pokemon to its next Form
 * @param {String} pokemonId The Pokemon's UUID
 * @param {String} nextForm The Pokemon's evolved form
 * @returns the updated Pokemon
 */
export async function evolvePokemon(pokemonId, nextForm){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(nextForm, 'nextForm');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const endpoint = `${POKEMON_RESOURCE}/${pokemonId}/evolve?trainerId${trainerId}&nextForm=${nextForm}`;
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
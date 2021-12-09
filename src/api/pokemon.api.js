import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getPokemon } from './pokedex.api';
const POKEMON_RESOURCE = `${BASE_URL}/api/v1/pokemon`

/**
 * Queries the Pokemon collection using the id
 * @param {String} pokemonId The Pokemon's UUID
 * @returns a Pokemon
 */
export async function getPokemon(pokemonId){
    nullChecker(pokemonId, 'pokemonId');

    return await requestHandler(`${POKEMON_RESOURCE}/${pokemonId}`, METHODS.GET);
}

/**
 * Trades two users pokemon
 * @param {String} gmId The game master's UUID
 * @param {String} leftPokemonId The left trainer's Pokemon UUID
 * @param {String} rightPokemonId The right trainer's Pokemon UUID
 * @returns the updated Pokemon
 */
export async function tradePokemon(gmId,leftPokemonId,rightPokemonId){
    nullChecker(gmId, 'gmId');
    nullChecker(leftPokemonId, 'leftPokemonId');
    nullChecker(rightPokemonId, 'rightPokemonId');

    const endpoint = `${POKEMON_RESOURCE}/trade?gameMasterId${gmId}&leftPokemonId=${leftPokemonId}&rightPokemonId=${rightPokemonId}`;
    return await requestHandler(endpoint, METHODS.PUT);
}

/**
 * Evolves a pokemon to its next Form
 * @param {String} pokemonId The Pokemon's UUID
 * @param {String} trainerId The trainer's UUID
 * @param {String} nextForm The Pokemon's evolved form
 * @returns the updated Pokemon
 */
export async function evolvePokemon(pokemonId,trainerId,nextForm){
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(trainerId, 'trainerId');
    nullChecker(nextForm, 'nextForm');

    const endpoint = `${POKEMON_RESOURCE}/${pokemonId}/evolve?trainerId${trainerId}&nextForm=${nextForm}`;
    return await requestHandler(endpoint, METHODS.PUT);
}

/**
 * Deletes a pokemon from the database
 * @param {String} pokemonId The Pokemon's UUID
 * @param {String} gmId The game master's UUID
 * @returns A generic message
 */
export async function deletePokemon(pokemonId,gmId){
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(gmId, 'gmId');

    return await requestHandler(`${POKEMON_RESOURCE}/${id}?gameMasterId=${gmId}`, METHODS.DELETE);
}
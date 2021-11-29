import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
const POKEDEX_RESOURCE = `${BASE_URL}/api/v1/pokedex`

export async function getAllPokemon(){
    return await requestHandler(`${POKEDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

export async function getPokemon(pokemon){
    nullChecker(pokemon, 'pokemon');

    return await requestHandler(`${POKEDEX_RESOURCE}/${pokemon}`, METHODS.GET);
}
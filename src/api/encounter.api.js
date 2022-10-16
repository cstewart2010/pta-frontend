import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getGameId, getUserCredentials } from '../utils/localStorage';
const ENCOUNTER_RESOURCE = `${BASE_URL}/api/v1/encounter`

/**
 * @returns The encounter
 */
export function getActiveEncounterWebSocket(){
    const gameId = getGameId();
    return new WebSocket(`${ENCOUNTER_RESOURCE.replace("https", "wss")}/${gameId}`);
}

/**
 * @returns All encounter associated with the current gameId
 */
export async function getAllEncounters(){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/all`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Create a new encounter for the current gameId
 * @param {string} name The name for the new encounter
 * @param {string} type The type of encounter
 * @returns 200
 */
export async function createEncounter(name, type){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const data = {
        name,
        type
    };
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}`, METHODS.POST, {activityToken, sessionAuth, data});
}

/**
 * Adds the current trainer to the active Encounter
 * @returns 200
 */
export async function addToActiveEncounter(participantData){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(participantData, 'participantData');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${trainerId}`, METHODS.PUT, {activityToken, sessionAuth, data: participantData});
}

export async function removeFromActiveEncounter(participantId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(participantId, 'participantId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${participantId}/remove`, METHODS.PUT, {activityToken, sessionAuth});
}


export async function returnToPokeball(pokemonId){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/return`, METHODS.PUT, {activityToken, sessionAuth});
}

export async function catchPokemon(pokemonId, catchRate, pokeball, nickname){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'gameMasterId');
    nullChecker(pokemonId, 'participantId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    nullChecker(catchRate, 'catchRate');
    nullChecker(pokeball, 'pokeball');

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/catch?catchRate=${catchRate}&pokeball=${pokeball.replace(" ", "_")}&nickname=${nickname}`, METHODS.PUT, {activityToken, sessionAuth})
}

/**
 * Updates the participants position on the map
 * @param {string} participantId The participant to change
 * @returns 200
 */
export async function updateParticipantPosition(participantId, x, y){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(participantId, 'participantId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const data = {
        x,
        y
    };

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${participantId}/position`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates the current trainer's position on the map
 * @returns 200
 */
export async function updateTrainerPosition(x, y){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(x, 'x');
    nullChecker(y, 'y');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const data = {
        x,
        y
    };
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${trainerId}/trainer_position`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates a current trainer's pokemon's position on the map
 * @param {string} pokemonId The trainer's pokemon
 * @returns 
 */
export async function updatePokemonPosition(pokemonId, x, y){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const data = {
        x,
        y
    };
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${trainerId}/${pokemonId}/pokemon_position`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Set the selected encounter to active
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function setEncounterToActive(encounterId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${encounterId}/active`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Set the selected encounter to inactive
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function setEncounterToInactive(encounterId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${encounterId}/inactive`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Update the encounter's data with user's latest hps
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function updateParticipantsHp(encounterId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${encounterId}/hp`, METHODS.PUT, {activityToken, sessionAuth});
}


/**
 * Deletes the selected encounter
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function deleteEncounter(encounterId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}/${encounterId}`, METHODS.DELETE, {activityToken, sessionAuth});
}


/**
 * Deletes all encounters associated with the current gameId
 * @returns 200
 */
export async function deleteAllEncounters(){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}/${gameMasterId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
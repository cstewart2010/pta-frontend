import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getUserCredentials } from '../utils/localStorage';
const ENCOUNTER_RESOURCE = `${BASE_URL}/api/v1/encounter`

/**
 * @param {string} gameId The gameId for the encounter
 * @returns The encounter
 */
export async function getActiveEncounter(gameId){
    nullChecker(gameId, 'gameId');

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameId}`, METHODS.GET);
}

/**
 * @returns All encounter associated with the current gameId
 */
export async function getAllEncounters(){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/all`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Create a new encounter for the current gameId
 * @param {string} name The name for the new encounter
 * @param {string} type The type of encounter
 * @returns 200
 */
export async function createEncounter(name, type){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    const data = {
        name,
        type
    };
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}`, METHODS.POST, {activityToken, sessionAuth, data});
}

/**
 * Adds the current trainer to the active Encounter
 * @returns 200
 */
export async function addToActiveEncounter(participantData){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(participantData, 'participantData');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${trainerId}`, METHODS.PUT, {activityToken, sessionAuth, data: participantData});
}

export async function removeFromActiveEncounter(participantId){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(participantId, 'participantId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/remove/${participantId}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Updates the participants position on the map
 * @param {string} participantId The participant to change
 * @returns 200
 */
export async function updateParticipantPosition(participantId, x, y){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(participantId, 'participantId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const data = {
        x,
        y
    };

    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/position/${participantId}`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates the current trainer's position on the map
 * @returns 200
 */
export async function updateTrainerPosition(x, y){
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
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${trainerId}/trainer_position`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Updates a current trainer's pokemon's position on the map
 * @param {string} pokemonId The trainer's pokemon
 * @returns 
 */
export async function updatePokemonPosition(pokemonId, x, y){
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(pokemonId, 'pokemonId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    const data = {
        x,
        y
    };
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${trainerId}/pokemon_position/${pokemonId}`, METHODS.PUT, {activityToken, sessionAuth, data});
}

/**
 * Set the selected encounter to active
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function setEncounterToActive(encounterId){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/active/${encounterId}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Set the selected encounter to inactive
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function setEncounterToInactive(encounterId){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/inactive/${encounterId}`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Update the encounter's data with user's latest hps
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function updateParticipantsHp(encounterId){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/hp/${encounterId}`, METHODS.PUT, {activityToken, sessionAuth});
}


/**
 * Deletes the selected encounter
 * @param {string} encounterId The encounter
 * @returns 200
 */
export async function deleteEncounter(encounterId){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(encounterId, 'encounterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}/${encounterId}`, METHODS.DELETE, {activityToken, sessionAuth});
}


/**
 * Deletes all encounters associated with the current gameId
 * @returns 200
 */
export async function deleteAllEncounters(){
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    
    return await requestHandler(`${ENCOUNTER_RESOURCE}/${gameMasterId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
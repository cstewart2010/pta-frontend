import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker} from './axiosHandler';
import { getGameId, getUserCredentials } from '../utils/localStorage';
const NPC_RESOURCE = `${BASE_URL}/api/v1/npc`

/**
 * returns npc by id
 * @param {string} npcId 
 * @returns NpcModel
 */
export async function getNpc(npcId){
  const [gmId, activityToken, sessionAuth] = getUserCredentials();
  nullChecker(npcId, 'npcId'); 
  nullChecker(gmId, 'gmId');
  nullChecker(activityToken, 'activityToken');
  nullChecker(sessionAuth, 'sessionAuth');
  return await requestHandler(`${NPC_RESOURCE}/${gmId}/${npcId}`, METHODS.GET, {sessionAuth, activityToken})
}

/**
 * returns a npc's pokemon by id 
 * @param {String} npcId 
 * @param {String} pokemonId 
 * @returns PokemonModel
 */
 export async function getNpcMon(npcId, pokemonId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials(); 
    nullChecker(npcId, 'npcId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${npcId}/pokemon/${pokemonId}?gameMasterId=${gmId}`, METHODS.GET, {sessionAuth, activityToken})
 }

 /**
  * Returns all Npcs in game by gameId
  * @returns NpcModel
  */
  export async function getNpcsInGame(){
    const [gmId, activityToken, sessionAuth] = getUserCredentials(); 
    const gameId = getGameId();
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    nullChecker(gameId, 'gameId');
    return await requestHandler(`${NPC_RESOURCE}/${gmId}/all/${gameId}`, METHODS.GET, {sessionAuth, activityToken})
  }
    
/**
 * Creates new npc with specified information
 * @param {String} trainerName 
 * @param {String[]} classes 
 * @param {String[]} feats 
 * @returns NpcModel
 */
export async function createNewNpc(trainerName, classes, feats){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    nullChecker(trainerName, 'trainerName');
    nullChecker(classes, 'classes');
    nullChecker(feats, 'feats');

    const data = {
        trainerName,
        classes,
        feats
    }
    return await requestHandler(`${NPC_RESOURCE}/${gmId}/new`, METHODS.POST, {sessionAuth, activityToken, data})
}


/**
 * Updates Npc's stats by NpcId
 * @param {String} npcId 
 * @returns NpcModel
 */
  export async function addNpcStats(npcId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(npcId, 'npcId'); 
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${gmId}/${npcId}/addStats`, METHODS.PUT, {sessionAuth, activityToken})
  }

/**
 * Deletes Npc by NpcId
 * @param {String} npcId 
 * @returns 200 status
 */
export async function deleteNpc(npcId){
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(npcId, 'npcId'); 
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${gmId}/${npcId}`, METHODS.DELETE, {sessionAuth, activityToken})
}

/**
 * Deletes all Npcs in game by gameId
 * @returns 200 status
 */
 export async function deleteNpcsInGame(){
    const [gmId, activityToken, sessionAuth] = getUserCredentials(); 
    const gameId = getGameId();
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    nullChecker(gameId, 'gameId');
    return await requestHandler(`${NPC_RESOURCE}/${gmId}/all/${gameId}`, METHODS.DELETE, {sessionAuth, activityToken})
}

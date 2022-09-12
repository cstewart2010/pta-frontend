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
  const gameId = getGameId();
  const [gmId, activityToken, sessionAuth] = getUserCredentials();
  nullChecker(npcId, 'npcId'); 
  nullChecker(gmId, 'gmId');
  nullChecker(activityToken, 'activityToken');
  nullChecker(sessionAuth, 'sessionAuth');

  return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/${npcId}`, METHODS.GET, {sessionAuth, activityToken})
}

/**
 * returns a npc's pokemon by id 
 * @param {String} npcId 
 * @param {String} pokemonId 
 * @returns PokemonModel
 */
 export async function getNpcMon(npcId, pokemonId){
  const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials(); 
    nullChecker(npcId, 'npcId');
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/${npcId}/${pokemonId}`, METHODS.GET, {sessionAuth, activityToken})
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
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/npcs/all`, METHODS.GET, {sessionAuth, activityToken})
  }
    
/**
 * Creates new npc with specified information
 * @param {String} trainerName 
 * @param {String[]} classes 
 * @param {String[]} feats 
 * @returns NpcModel
 */
export async function createNewNpc(trainerName, classes, feats){
  const gameId = getGameId();
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
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/new`, METHODS.POST, {sessionAuth, activityToken, data})
}

export async function createNpcPokemon(npcId, pokemon){
  const gameId = getGameId();
  const [gmId, activityToken, sessionAuth] = getUserCredentials();
  nullChecker(npcId, 'npcId'); 
  nullChecker(gmId, 'gmId');
  nullChecker(activityToken, 'activityToken');
  nullChecker(sessionAuth, 'sessionAuth');
  nullChecker(pokemon, 'pokemon')
  return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/${npcId}/new`, METHODS.POST, {sessionAuth, activityToken, data:pokemon})
}

/**
 * Updates Npc's stats by NpcId
 * @param {String} npcId 
 * @returns NpcModel
 */
  export async function addNpcStats(npcId){
    const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    const ptaLocalStorage = require('../utils/localStorage')
    const npc = ptaLocalStorage.getNpc(npcId);
    npc.pokemonTeam = [];
    nullChecker(npcId, 'npcId');
    nullChecker(npc, 'npc');  
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/${npcId}/addStats`, METHODS.PUT, {sessionAuth, activityToken, data : npc})
  }

/**
 * Deletes Npc by NpcId
 * @param {String} npcId 
 * @returns 200 status
 */
export async function deleteNpc(npcId){
  const gameId = getGameId();
    const [gmId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(npcId, 'npcId'); 
    nullChecker(gmId, 'gmId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/${npcId}`, METHODS.DELETE, {sessionAuth, activityToken})
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
    return await requestHandler(`${NPC_RESOURCE}/${gameId}/${gmId}/npcs/all`, METHODS.DELETE, {sessionAuth, activityToken})
}

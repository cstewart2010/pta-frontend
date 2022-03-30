import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker, natureChecker, statusChecker, genderChecker } from './axiosHandler';
const NPC_RESOURCE = `${BASE_URL}/api/v1/npc`

/**
 * 
 * @param {String} npcId 
 * @returns 
 */
export async function getNpc(npcId){
 nullChecker(npcId, 'npcId');
 return await requestHandler(`${NPC_RESOURCE}/${npcId}`, METHODS.GET);
}

/**
 * 
 * @param {String} trainerName 
 * @param {String[]} classes 
 * @param {String[]} feats 
 * @returns 
 */
export async function createNewNpc(trainerName, classes, feats){
    nullChecker(trainerName, 'trainerName');
    nullChecker(classes, 'classes');
    nullChecker(feats, 'feats');

    const data = {
        trainerName,
        classes,
        feats
    }
    return await requestHandler(`${NPC_RESOURCE}/new`, METHODS.POST, {data})
}

/**
 * 
 * @param {String} npcId 
 * @returns 
 */
export async function deleteNpc(npcId){
    nullChecker(npcId, 'npcId');
    return await requestHandler(`${NPC_RESOURCE}/${npcId}`, METHODS.DELETE)
}
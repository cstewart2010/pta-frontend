import axios from 'axios';

const baseURL = "https://localhost:44344/api/v1/game"
const client = axios.create({
    baseURL
});

/**
 * 
 * @param {String} gameId 
 * @returns 
 */
export async function findGame(gameId) {
    try {
        const {data} = await client.get(`/${gameId}`);
        return [null, data];
    }
    catch (error) {
        return [error]
    }
}

/**
 * 
 * @param {String} gameId 
 * @param {String} trainerId 
 * @returns 
 */
export async function findTrainerInGame(gameId, trainerId) {
    return await client.get(`/${gameId}/${trainerId}`).catch(errorHandler);
}

export async function createNewGame(){
    try {
        const {data} = await client.post("/new", null);
        return [null, data];
    }
    catch (error) {
        return [error]
    }
}

/**
 * 
 * @param {String} gameId 
 * @param {boolean} isGM 
 * @param {Object} body 
 * @returns 
 */
export async function addPlayerToGame(gameId, isGM, body){
    const endPoint = isGM
        ? 'gm'
        : 'new';
    return await client.post(`/${gameId}/${endPoint}`, body).catch(errorHandler);
}

/**
 * 
 * @param {String} gameId 
 * @param {Object} body 
 * @returns 
 */
export async function resetPassword(gameId, body){
    return await client.put(`/${gameId}/reset`, body).catch(errorHandler);
}

/**
 * 
 * @param {String} gameId 
 * @returns 
 */
export async function deleteGame(gameId){
    return await client.delete(`/${gameId}`).catch(errorHandler);
}

const errorHandler = (error) => {
    return [error];
}
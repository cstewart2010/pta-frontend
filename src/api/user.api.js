import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getGameId, getIsGM, getUserCredentials } from '../utils/localStorage';
const USER_RESOURCE = `${BASE_URL}/api/v1/user`

/**
 * @param {string} userId 
 * @returns a user's username
 */
export async function getUsername(userId){
    return await requestHandler(`${USER_RESOURCE}/${userId}`, METHODS.GET);
}

/**
 * @param {Number} offset 
 * @param {Number} limit 
 * @returns a page of users
 */
export async function getUsers(offset, limit){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/admin/allUsers?offset=${offset}&limit=${limit}`, METHODS.GET, {activityToken, sessionAuth})
}

/**
 * @param {string} messageId 
 * @returns a message thread
 */
export async function forceGetMessage(messageId){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}/admin/message`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * @param {string} messageId 
 * @returns a message thread
 */
export async function getMessage(messageId){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(messageId, 'messageId');
    
    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Creates a new user
 * @param {string} username 
 * @param {string} password 
 * @returns 200 status
 */
export async function createNewUser(username, password){
    nullChecker(username, 'username');
    nullChecker(password, 'password');

    return await requestHandler(`${USER_RESOURCE}?username=${username}&password=${password}`, METHODS.POST);
}

/**
 * Sends a message to a user
 * @param {string} recipientId 
 * @param {string} messageContents 
 * @returns 200 status
 */
export async function sendMessage(recipientId, messageContents){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(recipientId, 'recipientId');
    nullChecker(messageContents, 'messageContents');

    return await requestHandler(`${USER_RESOURCE}/${userId}/${recipientId}/sendMessage`, METHODS.POST, {activityToken, sessionAuth, data: {messageContents}})
}

/**
 * Replies to a message thread
 * @param {string} messageId 
 * @param {string} messageContents 
 * @returns 200 status
 */
export async function replyMessage(messageId, messageContents){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(messageId, 'messageId');
    nullChecker(messageContents, 'messageContents');

    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}/replyMessage`, METHODS.PUT, {activityToken, sessionAuth, data: {messageContents}})
}

/**
 * Refreshes the activity while in a game
 * @returns 200 status
 */
export async function refreshInGame(){
    const gameId = getGameId();
    const isGM = getIsGM();
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${gameId}/${userId}/refresh?isGM=${isGM}`, METHODS.PUT, {activityToken, sessionAuth})
}

/**
 * Logs a user in
 * @param {string} username 
 * @param {string} password 
 * @returns 200 status
 */
export async function login(username, password){
    const data = {
        username,
        password
    };

    return await requestHandler(`${USER_RESOURCE}/login`, METHODS.PUT, {data});
}

/**
 * Logs a user out
 * @returns 200 status
 */
export async function logout(){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/logout`, METHODS.PUT, {activityToken, sessionAuth});
}

/**
 * Deletes the current user
 * @returns 200 status
 */
export async function deleteUser(){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${userId}`, METHODS.DELETE, {activityToken, sessionAuth});
}

/**
 * Delete any user
 * @param {string} userId 
 * @returns 200 status
 */
export async function forceDeleteUser(userId){
    const [adminId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${adminId}/${userId}/admin`, METHODS.DELETE, {activityToken, sessionAuth});
}
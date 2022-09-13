import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getGameId, getIsGM, getUserCredentials } from '../utils/localStorage';
const USER_RESOURCE = `${BASE_URL}/api/v1/user`

export async function getUsername(userId){
    return await requestHandler(`${USER_RESOURCE}/${userId}`, METHODS.GET);
}

export async function getUsers(offset, limit){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/admin/allUsers?offset=${offset}&limit=${limit}`, METHODS.GET, {activityToken, sessionAuth})
}

export async function forceGetMessage(messageId){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}/admin/message`, METHODS.GET, {activityToken, sessionAuth});
}

export async function getMessage(messageId){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(messageId, 'messageId');
    
    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}`, METHODS.GET, {activityToken, sessionAuth});
}

export async function createNewUser(username, password){
    nullChecker(username, 'username');
    nullChecker(password, 'password');

    return await requestHandler(`${USER_RESOURCE}?username=${username}&password=${password}`, METHODS.POST);
}

export async function sendMessage(recipientId, messageContents){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(recipientId, 'recipientId');
    nullChecker(messageContents, 'messageContents');

    return await requestHandler(`${USER_RESOURCE}/${userId}/${recipientId}/sendMessage`, METHODS.POST, {activityToken, sessionAuth, data: {messageContents}})
}

export async function replyMessage(messageId, messageContents){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(messageId, 'messageId');
    nullChecker(messageContents, 'messageContents');

    return await requestHandler(`${USER_RESOURCE}/${userId}/${messageId}/replyMessage`, METHODS.PUT, {activityToken, sessionAuth, data: {messageContents}})
}

export async function refreshInGame(){
    const gameId = getGameId();
    const isGM = getIsGM();
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${gameId}/${userId}/refresh?isGM=${isGM}`, METHODS.PUT, {activityToken, sessionAuth})
}

export async function login(username, password){
    const data = {
        username,
        password
    };

    return await requestHandler(`${USER_RESOURCE}/login`, METHODS.PUT, {data});
}

export async function logout(){
    const [userId, activityToken, sessionAuth] = getUserCredentials();

    return await requestHandler(`${USER_RESOURCE}/${userId}/logout`, METHODS.PUT, {activityToken, sessionAuth});
}

export async function deleteUser(){
    const [userId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${userId}`, METHODS.DELETE, {activityToken, sessionAuth});
}

export async function forceDeleteUser(userId){
    const [adminId, activityToken, sessionAuth] = getUserCredentials();
    
    return await requestHandler(`${USER_RESOURCE}/${adminId}/${userId}/admin`, METHODS.DELETE, {activityToken, sessionAuth});
}
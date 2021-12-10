const ACTIVITY_TOKEN = "ptaActivityToken";
const GAME_ID = "gameId";
const IS_AUTHENTICATE = "isAuthenticated";
const IS_GM = "isGM";
const SESSION_AUTH = "ptaSessionAuth";
const TRAINER_ID = "trainerId";

export function getUserCredentials(){
    return [
        getTrainerId(),
        getPTAActivityToken(),
        getSessionAuth() 
    ]
}

export function getPTAActivityToken(){
    return localStorage.getItem(ACTIVITY_TOKEN);
}

export function getGameId(){
    return localStorage.getItem(GAME_ID);
}

export function getIsAuthenticate(){
    return getParsedItem(IS_AUTHENTICATE);
}

export function getIsGM(){
    return getParsedItem(IS_GM);
}

export function getSessionAuth(){
    return localStorage.getItem(SESSION_AUTH);
}

export function getTrainerId(){
    return localStorage.getItem(TRAINER_ID);
}

export function setPTAActivityToken(token){
    localStorage.setItem(ACTIVITY_TOKEN, token);
}

export function setGameId(gameId){
    localStorage.setItem(GAME_ID, gameId);
}

export function setIsAuthenticate(isAuthenticated){
    localStorage.setItem(IS_AUTHENTICATE, isAuthenticated);
}

export function setIsGM(isGM){
    localStorage.setItem(IS_GM, isGM);
}

export function setSessionAuth(sessionAuth){
    localStorage.setItem(SESSION_AUTH, sessionAuth);
}

export function setTrainerId(trainerId){
    localStorage.setItem(TRAINER_ID, trainerId);
}

export function removeFromStorage(){
    localStorage.clear();
}

const getParsedItem = key => JSON.parse(localStorage.getItem(key));
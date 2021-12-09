const AUTH_STRING = "ptaAuthString";

export function getDataFromStorage(){
    const authString = localStorage.getItem(AUTH_STRING);
    if (!authString){
        return {
            ptaActivityToken: null,
            ptaSessionAuth: null,
            trainerId: null,
            gameId: null,
            needsToAuthenticate: true
        };
    }

    try {
        return JSON.parse(authString);
    }
    catch {
        return {
            ptaActivityToken: null,
            ptaSessionAuth: null,
            trainerId: null,
            gameId: null,
            needsToAuthenticate: true
        };
    }
}

export function addToStorage(options){
    localStorage.removeItem(AUTH_STRING);
    if (options){
        options["needsToAuthenticate"] = false;
        localStorage.setItem(AUTH_STRING, JSON.stringify(options));
    }
}
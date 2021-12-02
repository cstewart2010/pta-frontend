const AUTH_STRING = "ptaAuthString";

export function checkStorage(){
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
        const auth = JSON.parse(authString);
        return {
            ptaActivityToken: auth.ptaActivityToken,
            ptaSessionAuth: auth.ptaSessionAuth,
            trainerId: auth.trainerId,
            gameId: auth.gameId,
            needsToAuthenticate: auth.needsToAuthenticate
        };
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
        localStorage.setItem(AUTH_STRING, options);
    }
}
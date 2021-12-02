
/**
 * Validates trainer credentials during signup
 * @param {String} username the trainers username
 * @param {String} password the trainers password
 * @param {String} confirm the password confirmation, should match the pass
 * @returns Returns true if all parameters are valid
 */
export function areTrainerSignupCredentialsValid(username, password, confirm){
    if (!(username && password && confirm)){
        alert("Please fill out all fields");
        return false;
    }
    if (password != confirm){
        alert("Passwords do not match");
        return false;
    }
    if (username.length < 6 || password.length < 6){
        alert("Name and password must be at least 6 characters long");
        return false;
    }

    return true;
}

/**
 * Validates new game credentials during signup
 * @param {String} password the game password
 * @param {String} confirm the password confirmation, should match the pass
 * @returns Returns true if all parameters are valid
 */
export function areGameSignupCredentialsValid(password, confirm){
    if (!(password && confirm)){
        alert("Please fill out all game credential fields");
        return false;
    }
    if (password != confirm){
        alert("Passwords do not match");
        return false;
    }
    if (password.length < 6){
        alert("Game password must be at least 6 characters long");
        return false;
    }

    return true;
}

/**
 * 
 * Validates trainer credentials during login
 * @param {String} username the trainers username
 * @param {String} password the trainers password
 * @returns Returns true if all parameters are valid
 */
export function areTrainerCredentialsValid(username, password){
    if (!(username && password)){
        alert("Please fill out all fields");
        return false;
    }

    if (username.length < 6 || password.length < 6){
        alert("Trainer name and password must be at least 6 characters long");
        return false;
    }

    return true;
}

/**
 * Validates game password during login
 * @param {String} password the trainers password
 * @returns Returns true if all parameters are valid
 */
export function isGamePasswordValid(password){
    if (!password){
        alert('Please fill out game password');
        return false;
    }

    if (password.length < 6){
        alert('Game password must be at least 6 characters long');
        return false;
    }

    return true;
}
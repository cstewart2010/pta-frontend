
/**
 * Validates trainer credentials during signup
 * @param {String} username the trainers username
 * @param {String} password the trainers password
 * @param {String} confirm the password confirmation, should match the pass
 * @returns Returns true if all parameters are valid
 */
export async function areTrainerSignupCredentialsValid(username, password, confirm){
    let reason = ''
    if (!(username && password && confirm)){
        reason = "Please fill out all fields";
    }
    if (password != confirm){
        reason = "Passwords do not match";
    }
    if (username.length < 6 || password.length < 6){
        reason = "Name and password must be at least 6 characters long";
    }

    if (reason.length > 1){
        throw {
            status: 'Invalid credentials field',
            reason
        }
    }

    return true;
}

/**
 * Validates new game credentials during signup
 * @param {String} password the game password
 * @param {String} confirm the password confirmation, should match the pass
 * @returns Returns true if all parameters are valid
 */
export async function areGameSignupCredentialsValid(password, confirm){
    let reason = ''
    if (!(password && confirm)){
        reason = "Please fill out all game credential fields";
    }
    if (password != confirm){
        reason = "Passwords do not match";
    }
    if (password.length < 6){
        reason = "Game password must be at least 6 characters long";
    }

    if (reason.length > 1){
        throw {
            status: 'Invalid credentials field',
            reason
        }
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
export async function areTrainerCredentialsValid(username, password){
    let reason = ''
    if (!(username && password)){
        reason = "Please fill out all fields";
    }
    if (username.length < 6 || password.length < 6){
        reason = "Name and password must be at least 6 characters long";
    }

    if (reason.length > 1){
        throw {
            status: 'Invalid credentials field',
            reason
        }
    }

    return true;
}

/**
 * Validates game password during login
 * @param {String} password the trainers password
 * @returns Returns true if all parameters are valid
 */
export async function isGamePasswordValid(password){
    let reason = ''
    if (!password){
        reason = "Please fill out game password";
    }
    if (password.length < 6){
        reason = "Game password must be at least 6 characters long'";
    }

    if (reason.length > 1){
        throw {
            status: 'Invalid credentials field',
            reason
        }
    }

    return true;
}
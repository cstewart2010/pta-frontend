import axios from 'axios';
import {NATURES, GENDERS, STATUSES} from './enums.json'

/**
 * Handles request for PTA
 * @param {String} endpoint - endpoint to hit
 * @param {String} method - method to hit endpoint with
 * @param {String} activityToken the user's pta-activity-token
 * @param {String} sessionAuth the user's pta-session-auth
 * @returns An array with null reference in the first position and the response in the second position
 */
 export async function requestHandler(endpoint, method, {activityToken, sessionAuth, data, contentType}) {
    let parsedResponse = null;
    
    let headers = {}
    if (activityToken){
        headers = {'pta-activity-token': activityToken, 'pta-session-auth': sessionAuth};
    }
    if (contentType){
        headers['Content-Type'] = contentType;
    }
    else {
        headers['Content-Type'] = 'text/plain';
    }

    alert(JSON.stringify(headers));
    const config = {headers}
    switch (method.toUpperCase()){
        case "GET":
            parsedResponse = await axios.get(endpoint, config).then(dataUpdater);
            break;
        case "POST":
            parsedResponse = await axios.post(endpoint, data, config).then(dataUpdater);
            break;
        case "PUT":
            parsedResponse = await axios.put(endpoint, data, config).then(dataUpdater);
            break;
        case "DELETE":
            parsedResponse = await axios.delete(endpoint, config).then(dataUpdater);
            break;
        default:
            throw `Argument was out of range: ${method}`
    }

    if (!parsedResponse){
        throw `Failed to make ${method} request at ${endpoint}`
    }

    return parsedResponse;
}

/**
 * Throws an exception if the argument is not a valid nature
 * @param {String} nature 
 */
export function natureChecker(nature){
    nullChecker(nature, 'nature');
    if (!NATURES.includes(nature.toUpperCase())){
        throw `Invalid nature ${nature}`
    }
}

/**
 * Throws an exception if the argument is not a valid gender
 * @param {String} gender 
 */
export function genderChecker(gender){
    nullChecker(gender, 'gender');
    if (!GENDERS.includes(gender.toUpperCase())){
        throw `Invalid gender ${gender}`
    }
}

/**
 * Throws an exception if the argument is not a valid status
 * @param {String} status 
 */
export function statusChecker(status){
    nullChecker(status, 'status');
    if (!STATUSES.includes(status.toUpperCase())){
        throw `Invalid status ${status}`
    }
}

/**
 * Throws an exception if the arugment is null or undefined
 * @param argument the argument to check
 * @param {String} argumentName the argument's name in the function
 */
export function nullChecker(argument, argumentName){
    if (argument === null){
        throw `null argument ${argumentName}`
    }
    if (argument === undefined){
        throw `undefined argument ${argumentName}`
    }
}

/**
 * @param {import('axios').AxiosResponse} response 
 * @returns A parsed version of the response
 */
const dataUpdater = response => {
    return  {
        data: response.data,
        status: response.status,
        headers: response.headers
    }
}
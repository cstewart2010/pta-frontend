import axios from 'axios';
import {NATURES, GENDERS, STATUSES} from './enums.json'

const client = axios.create();
client.interceptors.response.use(dataUpdater);

/**
 * Handles request for PTA
 * @typedef {Object} Options 
 * @property {String} activityToken the user's pta-activity-token
 * @property {String} sessionAuth the user's pta-session-auth
 * @property {Object} data
 * @property {String} contentType
 * @param {String} endpoint - endpoint to hit
 * @param {String} method - method to hit endpoint with
 * @param {Options} options - additional optional parameters
 * @returns An array with null reference in the first position and the response in the second position
 */
 export async function requestHandler(endpoint, method, {activityToken, sessionAuth, data, contentType}={}) {
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

    const config = {headers};
    switch (method.toUpperCase()){
        case "GET":
            return await client.get(endpoint, config).catch(errorHandler);
        case "POST":
            return await client.post(endpoint, data, config).catch(errorHandler);
        case "PUT":
            return await client.put(endpoint, data, config).catch(errorHandler);
        case "DELETE":
            return await client.delete(endpoint, config).catch(errorHandler);
        default:
            throw `Argument was out of range: ${method}`
    }
}

/**
 * Throws an exception if the argument is not a valid nature
 * @param {String} nature 
 */
export function natureChecker(nature){
    nullChecker(nature, 'nature');
    if (!NATURES.includes(nature.toUpperCase())){
        throw debugError(`Invalid nature ${nature}`)
    }
}

/**
 * Throws an exception if the argument is not a valid gender
 * @param {String} gender 
 */
export function genderChecker(gender){
    nullChecker(gender, 'gender');
    if (!GENDERS.includes(gender.toUpperCase())){
        throw debugError(`Invalid gender ${gender}`)
    }
}

/**
 * Throws an exception if the argument is not a valid status
 * @param {String} status 
 */
export function statusChecker(status){
    nullChecker(status, 'status');
    if (!STATUSES.includes(status.toUpperCase())){
        throw debugError(`Invalid status ${status}`)
    }
}

/**
 * Throws an exception if the arugment is null or undefined
 * @param argument the argument to check
 * @param {String} argumentName the argument's name in the function
 */
export function nullChecker(argument, argumentName){
    if (argument === null){
        throw debugError(`null argument ${argumentName}`)
    }
    if (argument === undefined){
        throw debugError(`undefined argument ${argumentName}`)
    }
}

/**
 * @param {String} reason reason for the debug error
 * @returns an object to add to an error modal
 */
const debugError = reason => {
    return {
        status: 'Debug',
        reason
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

/**
 * Handles errors by alerting the client
 * @param {any} error 
 */
const errorHandler = error => {
    if (error.response){
        let reason = '';
        switch (error.response.status){
            case 401:
                reason = 'This action was not authorized';
                break;
            case 404:
                reason = 'This page was not found';
                break;
            case 400:
                reason = 'You made a malformed request';
                break;
            case 500:
                reason = 'Congrats, you broke it';
                break;
            default:
                reason = 'PTA Servers are down.';
                break;
        }

        throw {
            status: error.response.status,
            reason
        };
    }
    else {
        throw {
            status: 'Null Status',
            reason: 'PTA Servers are down.'
        };
    }
}
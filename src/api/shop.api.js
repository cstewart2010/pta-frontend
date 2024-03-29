import { BASE_URL } from './api.config.json'
import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
import { getGameId, getUserCredentials } from '../utils/localStorage';
const SHOP_RESOURCE = `${BASE_URL}/api/v1/shop`

/**
 * Return the shop
 * @param {String} shopId the shop's UUID
 */
export async function getShopGM(shopId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(shopId, 'shopId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}/${shopId}/gm`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Return the shop
 * @param {String} shopId the shop's UUID
 */
export async function getShopTrainer(shopId){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(shopId, 'shopId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${trainerId}/${shopId}/trainer`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Returns all shops
 */
export async function getShops(){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Returns all shops
 * @param {String} settingId the setting's UUID
 */
export async function getShopsBySettingGM(settingId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(settingId, 'settingId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}/${settingId}/setting/gm`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Returns all shops
 * @param {String} settingId the setting's UUID
 */
export async function getShopsBySettingTrainer(settingId){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(settingId, 'settingId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${trainerId}/${settingId}/setting/trainer`, METHODS.GET, {activityToken, sessionAuth});
}

/**
 * Create's the shop
 * @param {String} shopId the new shop
 */
export async function createShop(shop){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(shop, 'shop');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}`, METHODS.POST, {activityToken, sessionAuth, data: shop});
}

/**
 * Updates the shop
 * @param {String} shopId the shop's UUID
 * @param {String} shop the new shop
 */
export async function updateShop(shopId, shop){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(shopId, 'shopId');
    nullChecker(shop, 'shop');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}/${shopId}/update`, METHODS.PUT, {activityToken, sessionAuth, data: shop});
}

/**
 * Buys from the shop
 * @param {String} shopId the shop's UUID
 * @param {String} groceries the new items to purchase
 */
export async function purchaseFromShop(shopId, groceries){
    const gameId = getGameId();
    const [trainerId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(trainerId, 'trainerId');
    nullChecker(groceries, 'groceries');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${trainerId}/${shopId}/purchase`, METHODS.PUT, {activityToken, sessionAuth, data: groceries});
}

/**
 * Deletes the shop
 * @param {String} shopId the shop's UUID
 */
export async function deleteShop(shopId){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(shopId, 'shopId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}/${shopId}`, METHODS.DELETE, {activityToken, sessionAuth});
}

/**
 * Deletes a shops by the gameId
 */
export async function DeleteShopByGameId(){
    const gameId = getGameId();
    const [gameMasterId, activityToken, sessionAuth] = getUserCredentials();
    nullChecker(gameMasterId, 'gameMasterId');
    nullChecker(activityToken, 'activityToken');
    nullChecker(sessionAuth, 'sessionAuth');

    return await requestHandler(`${SHOP_RESOURCE}/${gameId}/${gameMasterId}`, METHODS.DELETE, {activityToken, sessionAuth});
}
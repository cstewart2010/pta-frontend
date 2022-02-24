import { METHODS } from './enums.json'
import { requestHandler, nullChecker } from './axiosHandler';
const POKEDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/pokedex`
const BERRYDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/berrydex`
const FEATUREDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/featuredex`
const ITEMDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/itemdex`
const ORIGINDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/origindex`
const CLASSDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/classdex`
const MOVEDEX_RESOURCE = `${process.env.BACKEND_URL}/api/v1/movedex`

/**
 * @returns All Pokemon in the pokedex
 */
export async function getAllPokemon(){
    return await requestHandler(`${POKEDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

/**
 * @returns All berry in the berrydex
 */
export async function getAllBerries(){
    return await requestHandler(`${BERRYDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

/**
 * @returns All general features in the featuredex
 */
export async function getAllGeneralFeatures(){
    return await requestHandler(`${FEATUREDEX_RESOURCE}/general?limit=2000`, METHODS.GET);
}

/**
 * @returns All legendary features in the featuredex
 */
export async function getAllLegendaryFeatures(){
    return await requestHandler(`${FEATUREDEX_RESOURCE}/legendary?limit=2000`, METHODS.GET);
}

/**
 * @returns All passives in the featuredex
 */
export async function getAllPassiveFeatures(){
    return await requestHandler(`${FEATUREDEX_RESOURCE}/passives?limit=2000`, METHODS.GET);
}

/**
 * @returns All skills in the featuredex
 */
export async function getAllSkillsFeatures(){
    return await requestHandler(`${FEATUREDEX_RESOURCE}/skills?limit=2000`, METHODS.GET);
}

/**
 * @returns All key items in the itemdex
 */
export async function getAllKeyItems(){
    return await requestHandler(`${ITEMDEX_RESOURCE}/key?limit=2000`, METHODS.GET);
}

/**
 * @returns All medical items in the itemdex
 */
export async function getAllMedicalItems(){
    return await requestHandler(`${ITEMDEX_RESOURCE}/medical?limit=2000`, METHODS.GET);
}

/**
 * @returns All pokeballs in the itemdex
 */
export async function getAllPokeballItems(){
    return await requestHandler(`${ITEMDEX_RESOURCE}/pokeball?limit=2000`, METHODS.GET);
}

/**
 * @returns All pokemon items in the itemdex
 */
export async function getAllPokemonItems(){
    return await requestHandler(`${ITEMDEX_RESOURCE}/pokemon?limit=2000`, METHODS.GET);
}

/**
 * @returns All trainer equipment in the itemdex
 */
export async function getAllTrainerEquipment(){
    return await requestHandler(`${ITEMDEX_RESOURCE}/trainer?limit=2000`, METHODS.GET);
}

/**
 * @returns All origins in the origindex
 */
export async function getAllOrigins(){
    return await requestHandler(`${ORIGINDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

/**
 * @returns All trainer classes in the classdex
 */
export async function getAllTrainerClasses(){
    return await requestHandler(`${CLASSDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

/**
 * @returns All moves in the classdex
 */
export async function getAllMoves(){
    return await requestHandler(`${MOVEDEX_RESOURCE}?limit=2000`, METHODS.GET);
}

/**
 * @param {String} pokemon The name of the Pokemon to search for
 * @returns The Pokemon matching the name supplied
 */
export async function getPokemon(pokemon){
    nullChecker(pokemon, 'pokemon');

    return await requestHandler(`${POKEDEX_RESOURCE}/${pokemon}`, METHODS.GET);
}

/**
 * @param {String} berry The name of the berry to search for
 * @returns The berry matching the name supplied
 */
export async function getBerry(berry){
    nullChecker(berry, 'berry');

    return await requestHandler(`${BERRYDEX_RESOURCE}/${berry}`, METHODS.GET);
}

/**
 * @param {String} feature The name of the feature to search for
 * @returns The feature matching the name supplied
 */
export async function getGeneralFeature(feature){
    nullChecker(feature, 'feature');

    return await requestHandler(`${FEATUREDEX_RESOURCE}/general/${feature}`, METHODS.GET);
}

/**
 * @param {String} feature The name of the legendary feature to search for
 * @returns The legendary feature matching the name supplied
 */
export async function getLegendaryFeature(feature){
    nullChecker(feature, 'feature');

    return await requestHandler(`${FEATUREDEX_RESOURCE}/legendary/${feature}`, METHODS.GET);
}

/**
 * @param {String} feature The name of the passive to search for
 * @returns The passive matching the name supplied
 */
export async function getPassiveFeature(feature){
    nullChecker(feature, 'feature');

    return await requestHandler(`${FEATUREDEX_RESOURCE}/passives/${feature}`, METHODS.GET);
}

/**
 * @param {String} feature The name of the skill to search for
 * @returns The skill matching the name supplied
 */
export async function getSkillsFeature(feature){
    nullChecker(feature, 'feature');

    return await requestHandler(`${FEATUREDEX_RESOURCE}/skills/${feature}`, METHODS.GET);
}

/**
 * @param {String} item The name of the key item to search for
 * @returns The key item matching the name supplied
 */
export async function getKeyItem(item){
    nullChecker(item, 'item');

    return await requestHandler(`${ITEMDEX_RESOURCE}/key/${item}`, METHODS.GET);
}

/**
 * @param {String} item The name of the medical item to search for
 * @returns The medical item matching the name supplied
 */
export async function getMedicalItem(item){
    nullChecker(item, 'item');

    return await requestHandler(`${ITEMDEX_RESOURCE}/medical/${item}`, METHODS.GET);
}

/**
 * @param {String} item The name of the pokeball to search for
 * @returns The pokeball matching the name supplied
 */
export async function getPokeballItem(item){
    nullChecker(item, 'item');

    return await requestHandler(`${ITEMDEX_RESOURCE}/pokeball/${item}`, METHODS.GET);
}

/**
 * @param {String} item The name of the Pokemon item to search for
 * @returns The Pokemon item matching the name supplied
 */
export async function getPokemonItem(item){
    nullChecker(item, 'item');

    return await requestHandler(`${ITEMDEX_RESOURCE}/pokemon/${item}`, METHODS.GET);
}

/**
 * @param {String} item The name of the trainer equipment to search for
 * @returns The trainer equipment matching the name supplied
 */
export async function getTrainerEquipment(item){
    nullChecker(item, 'item');

    return await requestHandler(`${ITEMDEX_RESOURCE}/trainer/${item}`, METHODS.GET);
}

/**
 * @param {String} origin The name of the origin to search for
 * @returns The origin matching the name supplied
 */
export async function getOrigin(origin){
    nullChecker(origin, 'origin');

    return await requestHandler(`${ORIGINDEX_RESOURCE}/${origin}`, METHODS.GET);
}

/**
 * @param {String} trainerClass The name of the trainer class to search for
 * @returns The trainer class matching the name supplied
 */
export async function getTrainerClass(trainerClass){
    nullChecker(trainerClass, 'trainerClass');

    return await requestHandler(`${CLASSDEX_RESOURCE}/${trainerClass}`, METHODS.GET);
}

/**
 * @param {String} move The name of the move to search for
 * @returns The move matching the name supplied
 */
export async function getMove(move){
    nullChecker(move, 'move');

    return await requestHandler(`${MOVEDEX_RESOURCE}/${move}`, METHODS.GET);
}
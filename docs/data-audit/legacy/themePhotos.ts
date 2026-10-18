import places from './extraPlacePhotos.json'
import tower from './extraTowerPhotos.json'
import items from './extraItemPhotos.json'
import nights from './extraNightPhotos.json'
import architecture from './architecturePhotos.json'
import subculture from './subculturePhotos.json'
import additionalPlaces from './newPlacePhotos.json'
import additionalFood from './newFoodPhotos.json'
import archivedProducts from './archiveProductPhotos.json'
import archivedFood from './archiveFoodPhotos.json'
import archivedPlaces from './archivePlacePhotos.json'
import { photoById } from '../lib/photos'
import auditedPlaces from './auditedPlacePhotos.json'
import auditedTower from './auditedTowerPhoto.json'
/** Covers describe a theme; view photos identify one actual location. Never conflate the two. */
const coverIds:Record<string,string>={
 'tower-photos':'views-akabanebashi','rail-photo':additionalPlaces.themeCoverIds['rail-photo'],'night-view':'ginza','winter-lights':'theme-cover-winter',
 food:'theme-cover-food',characters:'harry','day-trips':'enoshima',desserts:'tricolore',
 convenience:'theme-cover-convenience',pharmacy:'theme-cover-pharmacy','city-interests':'roastery',
 architecture:'architecture-nact',
 subculture:'subculture-nintendo','december-tokyo':'winter-marunouchi-2019','anime-places':'anime-suga-shrine-stairs',
}
export const themeCoverIds:Record<string,string>=Object.fromEntries(Object.entries(coverIds).filter(([,id])=>photoById[id]))
const itemPhotoIds=Object.fromEntries(Object.entries(items.spotPhotos).map(([id,photos])=>[id,photos[0]]))
const archivedProductIds=Object.fromEntries(Object.entries(archivedProducts.spotPhotoIds).map(([id,photos])=>[id,photos[0]]))
const viewIds:Record<string,string>={
 ...itemPhotoIds,...places.spotPhotoIds,...tower.spotPhotoIds,...nights.spotPhotoIds,...architecture.spotPhotoIds,...subculture.spotPhotoIds,...additionalFood.spotPhotoIds,...archivedProductIds,...archivedFood.spotPhotoIds,...auditedPlaces.spotPhotoIds,...auditedTower.spotPhotoIds,
 'akabanebashi-photo':'views-akabanebashi','shiba-seven-photo':'views-shiba-seven','azabudai-photo':'views-azabudai',
 keyakizaka:'theme-cover-winter',
}
export const themeViewIds:Record<string,string>=Object.fromEntries(Object.entries(viewIds).filter(([,id])=>photoById[id]))
const extraPhotoIds:Record<string,string[]> = {
 ...Object.fromEntries(Object.entries({...additionalFood.spotPhotos,...archivedProducts.spotPhotoIds,...archivedFood.spotPhotos,...auditedPlaces.spotPhotos}).filter(([,ids])=>ids.length>1).map(([id,ids])=>[id,ids.slice(1)])),
 ...Object.fromEntries(Object.entries(archivedPlaces.spotPhotoIds).map(([id,photoId])=>[id,[photoId,...(archivedPlaces.additionalSpotPhotoIds as Record<string,string[]>)[id]??[]]])),
}
export const themeExtraPhotoIds:Record<string,string[]>=Object.fromEntries(Object.entries(extraPhotoIds).map(([id,ids])=>[id,ids.filter(photoId=>photoById[photoId])]))

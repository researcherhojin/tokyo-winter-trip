import photosData from '../data/photos.json'
import photoReview from '../data/photoReview.json'
import auditedPlaces from '../data/auditedPlacePhotos.json'
export interface Photo {
 src:string;alt:string;caption:string;author:string;license:string;licenseUrl:string;source:string
 fit?:'cover'|'contain'
 focus?:{x:number;y:number}
 width?:number;height?:number
 viewEvidence?:string
 checkedAt?:string
 timeOfDay?:string
 /** Set on stand-in photos that show a similar place or product, never the candidate itself. */
 reference?:{label:string;difference:string}
}
const raw:Record<string,Omit<Photo,'fit'>&{fit?:string}>=photosData
export const photoById:Record<string,Photo>=Object.fromEntries(Object.entries(raw).filter(([id])=>!Object.hasOwn(photoReview.excludedPhotos,id)).map(([id,photo])=>[id,{...photo,fit:photo.fit==='cover'?'cover':photo.fit==='contain'?'contain':undefined}]))
/** Card frames are 4:3 and never crop: every photo is shown whole over a blurred fill of itself (user request 2026-10-18). */
export function photoMode(_photo:Photo):'whole' {
 return 'whole'
}
/** Trip places whose own id was rejected in photoReview resolve to a separately audited photo. */
const placeAliases:Record<string,string>=auditedPlaces.placePhotoIds
export const placePhoto=(placeId:string):Photo|undefined=>photoById[placeAliases[placeId]??placeId]
/** Main place photo first, then audited extra views (exterior, interior, night, season) for the place detail gallery. */
const placeExtras:Record<string,string[]>=(auditedPlaces as {placeExtraPhotoIds?:Record<string,string[]>}).placeExtraPhotoIds??{}
export function placePhotoIds(placeId:string):string[] {
 const main=placeAliases[placeId]??placeId
 return [main,...(placeExtras[placeId]??[])].filter((id,index,list)=>photoById[id]&&list.indexOf(id)===index)
}

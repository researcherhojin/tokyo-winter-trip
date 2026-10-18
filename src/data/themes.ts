import tower_photos from './spots/tower-photos.json'
import rail_photo from './spots/rail-photo.json'
import night_view from './spots/night-view.json'
import food from './spots/food.json'
import day_trips from './spots/day-trips.json'
import desserts from './spots/desserts.json'
import convenience from './spots/convenience.json'
import pharmacy from './spots/pharmacy.json'
import city_interests from './spots/city-interests.json'
import architecture from './spots/architecture.json'
import subculture from './spots/subculture.json'
import anime_places from './spots/anime-places.json'
import december_tokyo from './spots/december-tokyo.json'
import type { ThemeEvidence } from './themeEvidence'
import type { VisitorInfo } from './visitorInfo'
import { photoById } from '../lib/photos'

export interface Reference { title: string; url: string; note?: string }
export interface TripClosureRecord { date: string; label: string; certainty: string }
/** One record per candidate: its text, hours, evidence, closures and photo ids live together in src/data/spots/<theme>.json. */
export interface ThemeSpot { scene?:{title:string;url:string;youtubeId:string;start:number;moment:string}; relation?:'작품 등장'|'작품 무대'|'공식 협업'; id: string; name: string; address: string; query: string; note: string; images?: string; details?: string; officialUrl?: string; placeId?: string; photoId?: string; photoIds?: string[]; referencePhotoId?: string; photoGap?: 'location'|'store'|'product'|'rights'; closures?: TripClosureRecord[]; kind?: 'place'|'product'|'unresolved'; references?: Reference[]; verified?: string; evidence?:ThemeEvidence; visitorInfo?:VisitorInfo }
export interface TravelTheme { id: string; title: string; description: string; day?: number; spots: ThemeSpot[]; references?: Reference[]; caution?: string; coverPhotoId?:string }

const records=[tower_photos, rail_photo, night_view, food, day_trips, desserts, convenience, pharmacy, city_interests, architecture, subculture, anime_places, december_tokyo] as unknown as TravelTheme[]
/** Photos excluded in photoReview.json disappear from photoById, so ids are re-checked at load and never shown stale. */
export const travelThemes:TravelTheme[]=records.map(theme=>({...theme,coverPhotoId:theme.coverPhotoId&&photoById[theme.coverPhotoId]?theme.coverPhotoId:undefined,spots:theme.spots.map(spot=>({...spot,photoId:spot.photoId&&photoById[spot.photoId]?spot.photoId:undefined,photoIds:spot.photoIds?.filter(id=>photoById[id]),referencePhotoId:spot.referencePhotoId&&photoById[spot.referencePhotoId]?.reference?spot.referencePhotoId:undefined}))}))
export function themeMapUrl(spot: ThemeSpot, directions=false) {
 return directions?'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:'東京都港区新橋5丁目29',destination:spot.query,travelmode:'transit'}):'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:spot.query})
}

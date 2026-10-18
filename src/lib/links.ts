import type { Place } from '../data/trip'
export function placeQuery(place: Place) { return place.mapQuery }
export function searchUrl(place: Place) {
 return `https://www.google.com/maps/search/?${new URLSearchParams({api:'1',query:placeQuery(place)})}`
}
export function directionsUrl(from: Place, to: Place, mode: 'transit' | 'walking' = 'transit') {
 return `https://www.google.com/maps/dir/?${new URLSearchParams({api:'1',origin:placeQuery(from),destination:placeQuery(to),travelmode:mode})}`
}

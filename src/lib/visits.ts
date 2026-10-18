import { placeById } from '../data/trip'
import type { Day, Place } from '../data/trip'
export interface Visit { place:Place; label:string }
export function getVisits(days:Day[], catalog:Record<string,Place>=placeById):Visit[] {
 const ids=[...new Set(days.flatMap(day=>day.stops.flatMap(stop=>stop.place?[stop.place]:[])))].filter(id=>id!=='lodging')
 return [...ids.map((id,index)=>({place:catalog[id],label:String(index+1)})),{place:catalog.lodging,label:'숙소'}]
}

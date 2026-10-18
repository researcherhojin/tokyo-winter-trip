import type { Day, Place } from '../data/trip'
import type { TravelTheme } from '../data/themes'
import type { suicaGuide, preparationSources, yoyogiSpot } from '../data/preparation'
import type { checklist } from '../data/trip'
import { photoById } from '../lib/photos'

/** Shared read contracts without the data itself, so each screen bundles only its own baseline. Personal completion state never leaves local storage. */
export interface CatalogShape {
 trip: { days: Day[]; places: Place[] }
 themes: { themes: TravelTheme[] }
 preparation: { checklist: typeof checklist; suicaGuide: typeof suicaGuide; preparationSources: typeof preparationSources; yoyogiSpot: typeof yoyogiSpot }
}
export type CatalogResource = keyof CatalogShape
export type CatalogData<K extends CatalogResource> = CatalogShape[K]
export interface CatalogEnvelope<K extends CatalogResource> {
 schemaVersion: 1
 resource: K
 source: 'maintained-catalog'
 data: CatalogData<K>
}
export const catalogPaths: Record<CatalogResource, string> = {
 trip: '/api/catalog/trip', themes: '/api/catalog/themes', preparation: '/api/catalog/preparation',
}
function record(value: unknown): value is Record<string, unknown> {
 return !!value && typeof value === 'object' && !Array.isArray(value)
}
function text(value: unknown): value is string { return typeof value === 'string' && value.length > 0 && value.length <= 20000 }
function string(value: unknown): value is string { return typeof value === 'string' && value.length <= 20000 }
function arrayOf<T>(value: unknown, valid: (item: unknown)=>item is T, minimum=0): value is T[] {
 return Array.isArray(value) && value.length >= minimum && value.length <= 200 && value.every(valid)
}
function list(value: unknown): value is Record<string,unknown>[] { return arrayOf(value,record,1) }
function unique(items: Record<string,unknown>[], key: string) { return new Set(items.map(item=>item[key])).size === items.length }
function optional(value: Record<string,unknown>, key: string, valid: (item:unknown)=>boolean) {
 return value[key] === undefined || valid(value[key])
}
function https(value: unknown): value is string {
 if (!text(value)) return false
 try { return new URL(value).protocol === 'https:' } catch { return false }
}
function date(value: unknown) { return text(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) }
function photoId(value:unknown){return text(value)&&Object.hasOwn(photoById,value)}
function nightPhoto(value:unknown){
 if(!record(value))return false
 const id=value.photoId??(record(value.evidence)?value.evidence.photoId:undefined)??value.placeId
 return text(id)&&['night','blue-hour'].includes(photoById[id]?.timeOfDay??'')
}
function reference(value: unknown): value is Record<string,unknown> {
 return record(value)&&text(value.title)&&https(value.url)&&optional(value,'note',string)
}
function references(value: unknown) { return arrayOf(value,reference) }
function visitorInfo(value:unknown){
 return record(value)&&['hours','closed','admission'].every(key=>text(value[key]))&&date(value.checkedAt)&&(value.sourceUrl===null||https(value.sourceUrl))&&optional(value,'note',string)
}
function guide(value: unknown) {
 return record(value) && ['overview','access','budget'].every(key=>text(value[key])) && date(value.checkedAt)
  && arrayOf(value.visitPlan,text,1) && arrayOf(value.tips,text,1) && arrayOf(value.sources,reference,1)
}
function place(value: unknown): value is Record<string,unknown> {
 return record(value) && ['id','name','jp','area','address','hours','booking','experience','positionNote','mapQuery'].every(key=>text(value[key]))
  && https(value.url) && https(value.coordinateSource) && date(value.checkedAt) && guide(value.guide)
  && record(value.position) && typeof value.position.lat==='number' && value.position.lat>35 && value.position.lat<36
  && typeof value.position.lng==='number' && value.position.lng>139 && value.position.lng<141
}
const bookingValues=['미확인','합의됨 · 결제 미확인','해당 없음','공유 항공편','결제 기록 · 상세 미확인','티켓 원문 확인']
function time(value: unknown) { return text(value) && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) }
function stopGuide(value:unknown){
 return record(value)&&text(value.purpose)&&arrayOf(value.steps,text,1)&&arrayOf(value.checks,text,1)&&text(value.next)&&date(value.checkedAt)&&arrayOf(value.sources,reference,1)
}
function stop(value: unknown, placeIds: Set<unknown>) {
 return record(value) && time(value.time) && text(value.title) && text(value.duration) && string(value.note)
  && ['place','from'].every(key=>optional(value,key,item=>text(item)&&placeIds.has(item)))
  && optional(value,'end',time) && optional(value,'optional',item=>typeof item==='boolean')
  && optional(value,'booking',item=>typeof item==='string'&&bookingValues.includes(item))
  && ['transit','travelTime'].every(key=>optional(value,key,string))
  && optional(value,'mode',item=>item==='transit'||item==='walking')
  && optional(value,'guide',stopGuide)
}
function safeLinks(value: unknown): boolean {
 if (Array.isArray(value)) return value.every(safeLinks)
 if (!record(value)) return true
 return Object.entries(value).every(([key,item]) =>
  key==='officialUrl'&&item===null ? true : ['url','officialUrl','coordinateSource','photoPageUrl'].includes(key) ? item===null&&key==='photoPageUrl'||https(item) : safeLinks(item))
}
function evidence(value:unknown){return record(value)&&['summary','photoNote','verificationNote'].every(key=>text(value[key]))&&date(value.checkedAt)&&['officialUrl','photoPageUrl'].every(key=>value[key]===null||https(value[key]))&&optional(value,'photoId',text)&&optional(value,'highlight',text)}
function themeSpot(value: unknown, baseline: Pick<CatalogShape['trip'],'places'>): boolean {
 return record(value) && text(value.id) && text(value.name) && string(value.address) && string(value.query) && text(value.note)
  && ['images','details','verified'].every(key=>optional(value,key,string)) && optional(value,'photoId',photoId)
  && optional(value,'officialUrl',https) && optional(value,'references',references)
  && optional(value,'photoIds',item=>arrayOf(item,(value):value is string=>photoId(value)))
  && optional(value,'placeId',item=>text(item)&&baseline.places.some(place=>place.id===item))
  && optional(value,'kind',item=>item==='place'||item==='product'||item==='unresolved')
  && optional(value,'evidence',evidence)
  && optional(value,'visitorInfo',visitorInfo)
}
/** Reject incomplete or malformed data before replacing the last usable catalog. `baseline` is the bundled copy a reply must not shrink. */
export function validateCatalogEnvelope<K extends CatalogResource>(value: unknown, resource: K, baseline: CatalogData<K>, places: CatalogShape['trip']['places']): value is CatalogEnvelope<K> {
 if (!record(value) || value.schemaVersion!==1 || value.resource!==resource || value.source!=='maintained-catalog' || !record(value.data) || !safeLinks(value.data)) return false
 const data=value.data
 if (resource==='trip') {
  if (!list(data.days)||data.days.length!==5||!unique(data.days,'id')||!arrayOf(data.places,place,1)||!unique(data.places,'id')) return false
  const placeIds=new Set(data.places.map(p=>p.id))
  return places.every(p=>placeIds.has(p.id)) && data.days.every(day=>
   typeof day.id==='number' && Number.isInteger(day.id) && day.id>=1 && day.id<=5
   && day.date===`2026-12-${10+day.id}` && ['title','weekday','subtitle','warning'].every(key=>text(day[key]))
   && text(day.color) && /^#[0-9a-f]{6}$/i.test(day.color) && list(day.resources) && list(day.stops)
   && day.resources.every(item=>reference(item)&&text(item.summary)) && day.stops.every(item=>stop(item,placeIds)))
 }
 if (resource==='themes') {
  if (!list(data.themes)||!unique(data.themes,'id')) return false
  const ids=new Set(data.themes.map(theme=>theme.id))
  const bundled=(baseline as CatalogShape['themes']).themes
  return bundled.every(theme=>ids.has(theme.id)) && data.themes.every(theme=>
   ['id','title','description'].every(key=>text(theme[key])) && optional(theme,'day',item=>typeof item==='number'&&Number.isInteger(item)&&item>=1&&item<=5)
   && optional(theme,'caution',string) && optional(theme,'coverPhotoId',photoId) && optional(theme,'references',references) && arrayOf(theme.spots,(spot):spot is Record<string,unknown>=>themeSpot(spot,{places}),1) && unique(theme.spots,'id')
   && (bundled.find(item=>item.id===theme.id)?.spots??[]).every(original=>(theme.spots as Record<string,unknown>[]).some(spot=>spot.id===original.id))
   && (theme.id!=='night-view'||theme.spots.every(nightPhoto)))
 }
 if (!list(data.checklist)||!unique(data.checklist,'id')||!list(data.suicaGuide)||!list(data.preparationSources)||!record(data.yoyogiSpot)) return false
 const ids=new Set(data.checklist.map(item=>item.id))
 return (baseline as CatalogShape['preparation']).checklist.every(item=>ids.has(item.id)) && data.checklist.every(item=>['id','title','group','note'].every(key=>text(item[key])))
  && data.suicaGuide.every(item=>text(item.title)&&text(item.body)) && data.preparationSources.every(reference)
  && ['title','description','note'].every(key=>text((data.yoyogiSpot as Record<string,unknown>)[key])) && https(data.yoyogiSpot.url)
}

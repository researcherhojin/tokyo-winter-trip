import type { Day, Stop } from '../data/trip'
export type VisitState = 'planned'|'done'|'skipped'
export type Progress = Record<string,VisitState>
export const progressKey='tokyo-2026-visits-v1'
export function stopKey(day:Day,stop:Stop){return `${day.date}/${stop.place??'event'}/${stop.title}`}
export function readProgress():Progress {
 try {const value:unknown=JSON.parse(localStorage.getItem(progressKey)||'{}');if(!value||typeof value!=='object'||Array.isArray(value))return {};return Object.fromEntries(Object.entries(value).filter(([,state])=>state==='planned'||state==='done'||state==='skipped')) as Progress}catch{return {}}
}
export function jstNow(date=new Date()) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date)
 const get=(type:string)=>parts.find(part=>part.type===type)?.value??''
 return {date:`${get('year')}-${get('month')}-${get('day')}`,time:`${get('hour')}:${get('minute')}`}
}
export function nextStop(day:Day,progress:Progress,now=jstNow()) {
 const open=day.stops.filter(stop=>!['done','skipped'].includes(progress[stopKey(day,stop)]??'planned'))
 if(now.date>day.date)return {stop:undefined,mode:'past' as const}
 if(now.date===day.date)return {stop:open.find(stop=>(stop.end??stop.time)>=now.time),mode:'today' as const}
 return {stop:open[0],mode:'preview' as const}
}

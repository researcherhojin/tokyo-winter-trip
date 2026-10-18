import type { Day, Stop } from '../data/trip'
import type { LiveTrip } from '../../server/notion'
export function isLiveTrip(value:unknown):value is LiveTrip{
 if(!value||typeof value!=='object')return false
 const trip=value as Record<string,unknown>
 const validDate=(date:unknown)=>typeof date==='string'&&Number.isFinite(Date.parse(date))
 if(trip.enabled!==true||trip.version!==1||!validDate(trip.lastEditedAt)||!validDate(trip.fetchedAt)||!Array.isArray(trip.days)||trip.days.length!==5)return false
 const ids=new Set<number>()
 for(const day of trip.days){
  if(!day||typeof day!=='object'||!Number.isInteger(day.id)||day.id<1||day.id>5||ids.has(day.id)||!Array.isArray(day.rows)||!day.rows.length||day.rows.length>40)return false
  ids.add(day.id)
  for(const row of day.rows){
   if(!row||typeof row!=='object'||typeof row.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d(?:\s*[–—−~-]\s*([01]\d|2[0-3]):[0-5]\d)?(?: 이후)?$/.test(row.time)||typeof row.title!=='string'||!row.title.trim()||typeof row.note!=='string'||[row.time,row.title,row.note].some(t=>t.length>2000))return false
  }
 }
 return true
}
const aliases:[RegExp,string][]=[[/나리타|공항 체크인/,'narita'],[/숙소 접근|체크아웃|체크인/,'lodging'],[/포켓몬센터.*스카이트리|소라마치.*포켓몬센터/,'skypokemon'],[/선샤인시티|MEGA TOKYO/,'mega'],[/스타워즈|PARCO/,'starwars'],[/해리포터|스튜디오/,'harry'],[/포케파크|포레스트|사초|요미우리/,'yomiuri'],[/오다이바/,'odaiba'],[/도쿄타워|조조지|시바공원/,'tower'],[/센소지|아사쿠사/,'sensoji'],[/스카이트리/,'skytree'],[/아키하바라/,'akihabara'],[/츠키지/,'tsukiji'],[/긴자/,'ginza'],[/신바시/,'shinbashi']]
function knownPlace(title:string){return aliases.find(([pattern])=>pattern.test(title))?.[1]}
export function applyLiveTrip(base:Day[],live:LiveTrip):Day[]{
 return base.map(day=>{
  const source=live.days.find(d=>d.id===day.id)!
  const stops:Stop[]=source.rows.map(row=>{
   const times=row.time.match(/\d{2}:\d{2}/g)!
   const segments=row.title.split(/\s*→\s*/)
   const place=knownPlace(segments.at(-1)!)
   const from=segments.length>1?knownPlace(segments[0]):undefined
   const matching=day.stops?.find(stop=>stop.time===times[0]&&stop.title===row.title&&stop.place===place)
   return {time:times[0],end:times[1],title:row.title,place,from,guide:matching?.guide,duration:'Notion 계획 · '+row.time,note:row.note,optional:/선택/.test(row.title),...(from&&place&&from!==place?{transit:row.note,travelTime:'Notion 계획',note:'운행·소요시간은 길찾기에서 다시 확인하세요.'}:{})}
  })
  return {...day,warning:'Notion 시간표에서 자동 반영한 계획입니다. 예약·운영 조건은 공식 안내와 예약 내역으로 확인하세요.',stops}
 })
}

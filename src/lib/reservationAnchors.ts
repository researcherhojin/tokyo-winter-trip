import { days } from '../data/trip'
import type { Day } from '../data/trip'
/** Ticket evidence takes precedence over the older illustrative timetable. */
export function anchorReservations(input:Day[]):Day[]{
 return input.map(day=>{
  if(day.id===2){
   const aligned=day.stops.some(stop=>/포켓몬 포레스트/.test(stop.title)&&stop.time==='11:00')
   return aligned?day:{...day,stops:days[1].stops,warning:days[1].warning}
  }
  if(day.id===3)return {...day,stops:day.stops.map(stop=>/해리포터.*투어|스튜디오 투어/.test(stop.title)?{...stop,time:'10:00',booking:'합의됨 · 결제 미확인'}:stop)}
  return day
 })
}

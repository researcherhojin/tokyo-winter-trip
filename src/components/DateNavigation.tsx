import { List, Map } from 'lucide-react'
import type { Day } from '../data/trip'
interface Props { days:Day[]; dayId:number; mobile:'map'|'list'; onDayChange:(id:number)=>void; onMobileChange:(view:'map'|'list')=>void }
export default function DateNavigation({days,dayId,mobile,onDayChange,onMobileChange}:Props) {
 return <div className="date-bar">
  <div className="date-bar-heading"><span className="month-label">2026년 12월</span><button className={`all-days ${dayId===0?'selected':''}`} aria-pressed={dayId===0} onClick={()=>onDayChange(0)}>전체 일정</button></div>
  <div className="date-tabs" role="group" aria-label="여행 날짜 선택">{days.map(day=><button key={day.id} className={dayId===day.id?'selected':''} aria-pressed={dayId===day.id} aria-label={`Day ${day.id}, 12월 ${10+day.id}일 ${day.weekday}요일`} onClick={()=>onDayChange(day.id)}><span className="sr-only">Day {day.id}</span><small>{day.weekday}</small><strong>{10+day.id}</strong></button>)}</div>
  <div className="mobile-switch" role="group" aria-label="모바일 보기"><button className={mobile==='list'?'selected':''} aria-pressed={mobile==='list'} onClick={()=>onMobileChange('list')}><List size={16}/>일정</button><button className={mobile==='map'?'selected':''} aria-pressed={mobile==='map'} onClick={()=>onMobileChange('map')}><Map size={16}/>지도</button></div>
 </div>
}

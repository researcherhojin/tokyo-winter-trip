import { useEffect,useRef,useState } from 'react'
import { ArrowUpRight,BedDouble,Check,ChevronDown,ChevronRight,Plane,Ticket,WifiOff,X } from 'lucide-react'
import type { Day,Stop } from '../data/trip'
import { daySupport,nearbyQueries,reservations,bookingPage } from '../data/travelSupport'
import { usePlaces } from '../hooks/PlaceCatalogContext'
import { nextStop,stopKey,jstNow } from '../lib/travelProgress'
import type { Progress,VisitState } from '../lib/travelProgress'
import { directionsUrl } from '../lib/links'
function mapSearch(query:string){return 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query})}
export function NearbyOptions({placeId}:{placeId:string}){
 const nearby=nearbyQueries[placeId]
 if(!nearby)return null
 return <details className="nearby-options"><summary>근처 식사·휴식 대안<ChevronDown size={14}/></summary><p>선택 장소 주변 검색입니다. 거리·평점·영업 중 여부는 Google Maps에서 확인하세요. 실내 후보는 입장·이용 조건을 별도로 확인하세요.</p><div>{[['식사',nearby.area+' レストラン'],['카페',nearby.area+' カフェ'],['실내 후보',nearby.indoor]].map(([label,query])=><a key={label} href={mapSearch(query)} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={14}/></a>)}</div></details>
}
export function VisitControl({day,stop,progress,onChange}:{day:Day;stop:Stop;progress:Progress;onChange:(key:string,state:VisitState)=>void}){
 const id=stopKey(day,stop)
 const state=progress[id]??'planned'
 return <label className="visit-control"><span>방문 상태</span><span className={`visit-select is-${state}`}><select aria-label={stop.title+' 방문 상태'} value={state} onChange={event=>onChange(id,event.target.value as VisitState)}><option value="planned">예정</option><option value="done">방문 완료</option><option value="skipped">이번에는 건너뜀</option></select><ChevronDown size={14} aria-hidden="true"/></span></label>
}
export function TodayFocus({day,progress,onPlace}:{day:Day;progress:Progress;onPlace:(id:string)=>void}){
 const places=usePlaces()
 const [now,setNow]=useState(()=>new Date())
 const [delayed,setDelayed]=useState(false)
 const [originOverride,setOriginOverride]=useState('')
 useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(timer)},[])
 const current=nextStop(day,progress,jstNow(now))
 const next=current.stop
 const config=daySupport[day.id]
 const index=next?day.stops.indexOf(next):-1
 const origin=originOverride||(next?.from??day.stops.slice(0,index).reverse().find(stop=>stop.place&&stop.place!==next?.place)?.place??'lodging')
 const destination=next?.place&&next.booking!=='공유 항공편'?places[next.place]:undefined
 const completed=day.stops.filter(stop=>progress[stopKey(day,stop)]==='done').length
 return <details className="today-focus"><summary><span><small>{current.mode==='preview'?'선택일 미리보기':current.mode==='past'?'지난 일정':'오늘의 다음 일정'} · {completed}/{day.stops.length} 완료</small><strong>{next?`${next.time} ${next.title}`:'남은 시간표 없음'}</strong></span><ChevronDown size={16}/></summary><div className="today-focus-body">
  <p className="small-note">{current.mode==='preview'?'여행 전에는 선택 날짜의 첫 미완료 일정을 표시합니다.':current.mode==='past'?'지난 날짜입니다. 방문 상태를 자동으로 완료 처리하지 않습니다.':'JST 시각과 직접 선택한 방문 상태 기준입니다. 실제 위치·운행 정보는 조회하지 않습니다.'}</p>
  <p><strong>이 날의 우선순위</strong><br/>{config.priority}</p><p className="protected-time">{config.protectedTime}</p>
  {next?.booking&&<p>예약 상태: {next.booking}</p>}
  {destination&&<><label className="next-origin">출발지<select aria-label="다음 일정 길찾기 출발지" value={origin} onChange={event=>setOriginOverride(event.target.value)}>{Object.values(places).map(place=><option key={place.id} value={place.id}>{place.name}</option>)}</select></label><a className="secondary-button" href={directionsUrl(places[origin]??places.lodging,destination,next?.mode)} target="_blank" rel="noreferrer">다음 장소 길찾기<ArrowUpRight size={14}/></a><button className="text-button" onClick={()=>onPlace(destination.id)}>장소 상세 보기</button><NearbyOptions placeId={destination.id}/></>}
  <div className="delay-choice" role="group" aria-label="일정 조정"><button aria-pressed={!delayed} onClick={()=>setDelayed(false)}>계획대로</button><button aria-pressed={delayed} onClick={()=>setDelayed(true)}>지연·피로 시</button></div>
  <p>{delayed?config.delay:day.warning}</p>{delayed&&<p className="small-note">시간표와 방문 상태는 자동으로 바꾸지 않습니다. 생략한 항목은 아래에서 ‘이번에는 건너뜀’으로 표시하세요.</p>}
  {day.id===2&&<a href={reservations.poke.source} target="_blank" rel="noreferrer">티켓 원본 확인<ArrowUpRight size={14}/></a>}
 </div></details>
}
const weekdays=['일','월','화','수','목','금','토']
const returnPlan=[['12:30','숙소에서 짐 회수'],['13:15','숙소 출발'],['15:30–16:00','나리타 T2 도착 목표'],['18:55','항공편 출발']]
export function TravelEssentials({onClose,onPlace}:{onClose:()=>void;onPlace:(id:string)=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 const places=usePlaces()
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[])
 return <dialog ref={ref} className="place-dialog essentials-dialog" onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose()}} aria-labelledby="essentials-title">
  <header className="essentials-head"><div><h2 id="essentials-title">여행 필수 정보</h2><p>예약 원문과 숙소·공항 이동을 한곳에서 확인하세요.</p></div><button className="detail-close" aria-label="필수 정보 닫기" onClick={onClose}><X size={20}/></button></header>
  <div className="essentials-content">
   <section aria-labelledby="essentials-booking"><div className="essentials-section-head"><h3 id="essentials-booking"><Ticket size={18} aria-hidden="true"/>예약 기준</h3><a href={bookingPage} target="_blank" rel="noreferrer">Notion 원본<ArrowUpRight size={14}/></a></div>
    <ul className="essentials-bookings">{Object.values(reservations).map(item=>{const date=new Date(item.date+'T00:00:00+09:00');return <li key={item.title}><div className="essentials-date" aria-label={`${date.getUTCMonth()+1}월 ${Number(item.date.slice(8))}일`}><small>12월</small><strong>{Number(item.date.slice(8))}</strong><small>{weekdays[new Date(item.date+'T12:00:00Z').getUTCDay()]}</small></div><div><strong>{item.title}</strong><p>{item.note}</p></div></li>})}</ul>
    <p className="essentials-note">티켓 QR·번호는 앱에 저장하지 않습니다. 원본 티켓을 개인 기기에 따로 저장하세요.</p>
   </section>
   <section aria-labelledby="essentials-stay"><h3 id="essentials-stay"><BedDouble size={18} aria-hidden="true"/>숙소와 공항</h3>
    <div className="essentials-actions">
     <button onClick={()=>{onClose();onPlace('lodging')}}><span><strong>신바시 숙소</strong><small>新橋5丁目29 구역 · 주소·접근 보기</small></span><ChevronRight size={18} aria-hidden="true"/></button>
     <a href={directionsUrl(places.lodging,places.narita)} target="_blank" rel="noreferrer"><span><strong>숙소 → 나리타 T2</strong><small>Google 지도 대중교통 길찾기</small></span><ArrowUpRight size={18} aria-hidden="true"/></a>
    </div>
    <p className="essentials-note">건물 입구·체크인·짐 보관은 숙소 예약 안내로 확인하세요.</p>
    <h4><Plane size={16} aria-hidden="true"/>12/15(화) 귀국일 계획</h4>
    <ol className="essentials-timeline">{returnPlan.map(([time,label])=><li key={time}><time>{time}</time><span>{label}</span></li>)}</ol>
    <p className="essentials-note">계획 시간입니다. 항공사 수속·탑승 마감 기준을 우선하세요.</p>
   </section>
   <section aria-labelledby="essentials-offline"><h3 id="essentials-offline"><WifiOff size={18} aria-hidden="true"/>연결이 끊기기 전에</h3>
    <ul className="essentials-checks">{['숙소 입실 안내와 주소','티켓 QR·항공권','귀국 교통편'].map(item=><li key={item}><Check size={16} aria-hidden="true"/>{item}</li>)}</ul>
    <p className="essentials-note">개인 기기에 미리 저장하세요. 외부 지도·실시간 조회는 네트워크가 필요하고, 방문 상태는 이 기기에만 저장됩니다.</p>
   </section>
  </div>
 </dialog>
}

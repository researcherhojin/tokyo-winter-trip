import { ArrowUpRight, TrainFront, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { usePlaces } from '../hooks/PlaceCatalogContext'
import type { Day } from '../data/trip'
import { directionsUrl } from '../lib/links'
import { PlaceThumbnail, PhotoCredit } from './PlacePhoto'
import { YoyogiCandidate } from './PreparationGuide'
import { TodayFocus,VisitControl,NearbyOptions } from './TravelSupport'
import type { Progress,VisitState } from '../lib/travelProgress'
import { stopKey } from '../lib/travelProgress'
import StopGuide from './StopGuide'

interface Props {
 day: Day
 section: 'schedule' | 'resources'
 onPlace: (id: string) => void
 selected: string | null
 markerLabels: Record<string,string>
 progress:Progress
 onProgress:(key:string,state:VisitState)=>void
}

export default function DaySchedule({ day, section, onPlace, selected, markerLabels,progress,onProgress }: Props) {
 const placeById=usePlaces()
 const unique = [...new Set(day.stops.flatMap(stop => stop.place ? [stop.place] : []))]
 return <article className="day-schedule">
  <header className="day-heading">
   <div className="day-heading-top"><span className="day-pill">Day {day.id}</span><span>12월 {10 + day.id}일 {day.weekday}요일</span></div>
   <h1>{day.title}</h1>
   <p>{unique.filter(id=>id!=='lodging').length}개 방문 장소 <span aria-hidden="true">/</span> 일본 현지시간</p>
  </header>
  <TodayFocus day={day} progress={progress} onPlace={onPlace}/>
  {section === 'resources' ? <div className="resources">
   <p className="small-note">2026.10.17 확인 · 방문일 운영시간은 출발 전에 다시 확인하세요.</p>
   {day.resources.map(resource => <a href={resource.url} key={resource.url} target="_blank" rel="noreferrer">
    <div><h2>{resource.title}</h2><ArrowUpRight size={18}/></div><p>{resource.summary}</p><small>{new URL(resource.url).hostname}</small>
   </a>)}
  </div> : <div className="timeline">{day.stops.map((stop, index) => {
   const firstVisit = stop.place && day.stops.findIndex(item => item.place === stop.place) === index
   const hasBooking = stop.booking && stop.booking !== '해당 없음'
   return <div key={index} className={`timeline-entry visit-${progress[stopKey(day,stop)]??'planned'}`}>
    {stop.transit && <div className="transit">
     <div className="transit-heading"><TrainFront size={16}/><strong>{stop.travelTime}</strong>
      {stop.from && stop.place && <a href={directionsUrl(placeById[stop.from], placeById[stop.place], stop.mode)} target="_blank" rel="noreferrer">{stop.mode === 'walking' ? '도보' : '대중교통'} 길찾기<ArrowUpRight size={14}/></a>}
     </div>
     <details><summary>환승·이동 경로<ChevronDown size={14}/></summary><p>{stop.transit}</p></details>
    </div>}
    <div className={`schedule-stop ${selected === stop.place ? 'highlight' : ''}`}>
     <span className={`timeline-dot ${stop.optional ? 'optional' : ''}`}>{stop.place ? markerLabels[stop.place] : '·'}</span>
     <div className="stop-body">
      <div className="stop-time"><time dateTime={`${day.date}T${stop.time}:00+09:00`}>{stop.time}{stop.end && <span>–{stop.end}</span>}</time><span className={stop.optional ? 'optional-label' : 'required-label'}>{stop.optional ? '선택' : '필수'}</span></div>
      <div className="stop-main">
       <div className="stop-description">
        {stop.place ? <button className="place-title" onClick={() => onPlace(stop.place!)}>{stop.title}<ChevronRight size={16}/></button> : <h2>{stop.title}</h2>}
        <div className="stop-duration">{stop.duration}</div>
        {hasBooking && <span className={`booking-status ${stop.booking === '공유 항공편' ? 'shared' : ''}`}>{stop.booking}</span>}
        {(firstVisit||stop.photoId) && stop.place && <PhotoCredit placeId={stop.place!} photoId={stop.photoId} compact/>}
       </div>
       {(firstVisit||stop.photoId) && stop.place && <button className="place-preview" onClick={() => onPlace(stop.place!)} aria-label={`${stop.photoId?stop.title:placeById[stop.place!].name} 사진과 상세보기`}><PlaceThumbnail placeId={stop.place!} photoId={stop.photoId}/></button>}
      </div>
      {stop.guide&&<p className="stop-overview">{stop.guide.purpose}</p>}
      {stop.place === 'starwars' && <p className="reservation-reminder">10/13 공식 공지: 일반 입장 예약제 종료 · 혼잡 시 정리권 확인</p>}
      <StopGuide stop={stop}/>
      <div className="stop-footer"><VisitControl day={day} stop={stop} progress={progress} onChange={onProgress}/>
      {firstVisit&&stop.place&&<NearbyOptions placeId={stop.place}/>}</div>
     </div>
    </div>
   </div>
  })}</div>}
  {day.id === 2 && section === 'resources' && <YoyogiCandidate/>}
  {day.id === 4 && section === 'schedule' && <div className="shop-links"><span>아키하바라 매장 지도</span>{['秋葉原ラジオ会館', 'アニメイト秋葉原'].map(name => <a key={name} href={`https://www.google.com/maps/search/?${new URLSearchParams({api:'1',query:name})}`} target="_blank" rel="noreferrer">{name === '秋葉原ラジオ会館' ? '라디오회관' : '애니메이트'}<ExternalLink size={14}/></a>)}</div>}
 </article>
}

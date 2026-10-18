import { Suspense, lazy, useEffect, useState } from 'react'
import { House, ClipboardCheck, ArrowUpRight, Map, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import useTripSource from './hooks/useTripSource'
import { PlaceCatalogProvider, usePlaces } from './hooks/PlaceCatalogContext'
import TravelMap from './components/TravelMap'
import PlaceDetail from './components/PlaceDetail'
import DaySchedule from './components/DaySchedule'
import DateNavigation from './components/DateNavigation'
import { TravelEssentials } from './components/TravelSupport'
import useTravelProgress from './hooks/useTravelProgress'
import { getVisits } from './lib/visits'
/** Theme and checklist screens (and their data) load on first visit so the trip map opens with less JavaScript. */
const ThemeExplorer=lazy(()=>import('./components/ThemeExplorer'))
const Checklist=lazy(()=>import('./components/Checklist'))
import { readNavigation, writeNavigation } from './lib/navigation'
import type { PageView } from './lib/navigation'
export default function App(){
 const source=useTripSource()
 return <PlaceCatalogProvider places={source.places}><AppWorkspace days={source.days} sourceLabel={source.sourceLabel}/></PlaceCatalogProvider>
}
function AppWorkspace({days,sourceLabel}:{days:ReturnType<typeof useTripSource>['days'];sourceLabel:string}) {
 const placeById=usePlaces()
 const [dayId,setDayId]=useState(()=>readNavigation().day)
 const [page,setPage]=useState<PageView>(()=>readNavigation().page)
 const [mobile,setMobile]=useState<'map'|'list'>('list')
 const [sheetExpanded,setSheetExpanded]=useState(false)
 const [section,setSection]=useState<'schedule'|'resources'>('schedule')
 const [selected,setSelected]=useState<string|null>(null)
 const [detail,setDetail]=useState<string|null>(null)
 const [essentials,setEssentials]=useState(false)
 const {progress,update,message}=useTravelProgress()
 useEffect(()=>{window.scrollTo(0,0)},[page])
 useEffect(()=>{
  const fn=()=>{const next=readNavigation();setDayId(next.day);setPage(next.page);setSelected(null);setDetail(null)}
  window.addEventListener('popstate',fn)
  return()=>window.removeEventListener('popstate',fn)
 },[])
 const visible=dayId===0?days:days.filter(d=>d.id===dayId)
 const markerLabels=Object.fromEntries(getVisits(visible,placeById).map(visit=>[visit.place.id,visit.label]))
 function changeMobile(view:'map'|'list'){setMobile(view);setSheetExpanded(view==='list')}
 function changePage(next:PageView){setPage(next);setDetail(null);writeNavigation(next,dayId)}
 function changeDay(id:number){
  setDayId(id);setSelected(null);setDetail(null);setPage('trip')
  writeNavigation('trip',id)
  document.querySelector('.itinerary-scroll')?.scrollTo(0,0)
 }
 function showPlace(id:string){setSelected(id);setDetail(id)}
 return <>
  <a className="skip-link" href="#main">본문으로 이동</a>
  <header className="site-header">
   <a className="brand" href="?day=1" aria-label="도쿄 여행 첫날"><span className="brand-word">tokyo<span className="brand-dot">.</span></span><small>여행 노트</small></a>
   <div className="trip-meta"><span>2026.12.11 — 12.15</span><span>4박 5일</span></div>
   <nav aria-label="주 메뉴">
    <button aria-current={page==='trip'?'page':undefined} className={page==='trip'?'nav-active':''} onClick={()=>changePage('trip')}><Map size={15}/><span>여행 지도</span></button>
    <button aria-current={page==='themes'?'page':undefined} className={page==='themes'?'nav-active':''} onClick={()=>changePage('themes')}><span>테마 탐색</span></button>
    <button aria-current={page==='checklist'?'page':undefined} className={page==='checklist'?'nav-active':''} onClick={()=>changePage('checklist')}><ClipboardCheck size={15}/><span>준비 체크</span></button>
    <a className="notion-link" href="https://app.notion.com/p/3cd6d10af85a802cab35dae642ee3500" target="_blank" rel="noreferrer">Notion <ArrowUpRight size={13}/></a>
   </nav>
  </header>
  <main id="main" tabIndex={-1} className={page==='trip'?'trip-page':page==='themes'?'discovery-page':'preparation-page'}>
   {page==='checklist'?<Suspense fallback={<p className="screen-loading" role="status">준비 체크를 불러오는 중</p>}><Checklist/></Suspense>:page==='themes'?<Suspense fallback={<p className="screen-loading" role="status">테마를 불러오는 중</p>}><ThemeExplorer onPlace={showPlace}/></Suspense>:<>
    <div className={`travel-workspace mobile-${mobile} ${sheetExpanded?'sheet-expanded':''}`}>
     <div className="map-column"><TravelMap days={visible} selected={selected} onSelect={showPlace} mode={mobile} expanded={sheetExpanded}/></div>
     <DateNavigation days={days} dayId={dayId} mobile={mobile} onDayChange={changeDay} onMobileChange={changeMobile}/>
     <section className="itinerary-panel" aria-label="여행 일정">
      <button className="sheet-toggle" onClick={()=>{setMobile('list');setSheetExpanded(mobile==='map'||!sheetExpanded)}} aria-expanded={sheetExpanded&&mobile==='list'} aria-label={sheetExpanded&&mobile==='list'?'지도와 함께 보기':'일정 펼치기'}><span className="sheet-handle"/><span>{dayId?`12월 ${10+dayId}일 일정`:'전체 여행 일정'}</span>{sheetExpanded&&mobile==='list'?<ChevronDown size={18}/>:<ChevronUp size={18}/>}</button>
      <div className="itinerary-tabs"><button onClick={()=>setSection('schedule')} className={section==='schedule'?'selected':''}>상세 일정</button><button onClick={()=>setSection('resources')} className={section==='resources'?'selected':''}>방문 가이드</button><button className="essentials-trigger" onClick={()=>setEssentials(true)}>필수 정보</button></div>
      <div className="itinerary-scroll">{visible.map(day=><DaySchedule key={day.id} day={day} section={section} onPlace={showPlace} selected={selected} markerLabels={markerLabels} progress={progress} onProgress={update}/>)}<p className="sr-only" role="status">{message}</p></div>
      <button className="lodging-bar" onClick={()=>showPlace('lodging')} aria-label="숙소 주소와 길찾기 보기"><House size={21}/><span><strong>신바시 숙소</strong><small>新橋5丁目29 · 주소·길찾기</small></span><ChevronRight size={18}/></button><div className="itinerary-footnote">{message.includes('제한')?<span role="status">{message}</span>:sourceLabel}</div>
     </section>
     
    </div>
   </>}
  </main>
  {detail&&placeById[detail]&&<PlaceDetail key={detail} place={placeById[detail]} onClose={()=>setDetail(null)}/>}
  {essentials&&<TravelEssentials onClose={()=>setEssentials(false)} onPlace={showPlace}/>}
 </>
}

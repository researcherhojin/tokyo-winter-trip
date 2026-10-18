import { useEffect, useRef, useState } from 'react'
import { MapPin, Maximize2, ExternalLink, RotateCw, ChevronRight, Plane } from 'lucide-react'
import type { Day, Place } from '../data/trip'
import { usePlaces } from '../hooks/PlaceCatalogContext'
import { assertMapAuthorization, loadGoogleMaps, MapLoadError } from '../lib/googleMaps'
import type { Bounds, CoreLibrary, MapFailure, MapInstance, MapsLibrary, Marker, MarkerLibrary } from '../lib/googleMaps'
import { googleMapsApiKey } from '../lib/config'
import { searchUrl } from '../lib/links'
import { getVisits } from '../lib/visits'
import { mapPadding } from '../lib/mapViewport'
interface Props { days: Day[]; selected: string | null; onSelect: (id: string) => void; mode?:'map'|'list'; expanded?:boolean }
type State = 'missing' | 'loading' | 'ready' | 'error'
const messages: Record<MapFailure, { title: string; text: string }> = {
 network: {title: '지도 요청을 불러오지 못했습니다', text: '연결 상태를 확인하세요. 브라우저·확장 프로그램이 Google 지도 요청을 차단하는 경우에도 발생할 수 있습니다.'},
 timeout: {title: '지도 연결이 지연되고 있습니다', text: '30초 안에 지도를 받지 못했습니다. 연결 상태와 브라우저의 요청 차단 여부를 확인한 뒤 다시 시도하세요.'},
 auth: {title: 'Google 지도 인증을 확인해 주세요', text: 'Google Cloud에서 Maps JavaScript API, 키의 웹사이트 제한, 프로젝트 결제 연결 상태를 확인하세요. 설정 변경 후 새로고침하세요.'},
 initialization: {title: '지도를 표시하지 못했습니다', text: '지도 초기화 중 문제가 발생했습니다. 다시 연결하거나 개발자 도구 Console의 Google Maps 오류 코드를 확인하세요.'}
}
export default function TravelMap({ days, selected, onSelect, mode='list', expanded=false }: Props) {
 const placeById=usePlaces()
 const host = useRef<HTMLDivElement>(null)
 const map = useRef<MapInstance | null>(null)
 const libraries = useRef<{maps: MapsLibrary; core: CoreLibrary; marker: MarkerLibrary} | null>(null)
 const bounds = useRef<Bounds | null>(null)
 /** Narita is ~60 km out; framing it with the city stops shrinks Tokyo to a few pixels, so the default frame is the city and the airport is one tap away. */
 const allBounds = useRef<Bounds | null>(null)
 const cityOnly = useRef<Bounds | null>(null)
 const withAirportRef = useRef(false)
 const [withAirport, setWithAirport] = useState(false)
 const markerViews = useRef(new globalThis.Map<string, {marker: Marker; button: HTMLButtonElement}>())
 const onSelectRef = useRef(onSelect)
 const [state, setState] = useState<State>(googleMapsApiKey ? 'loading' : 'missing')
 const [failure, setFailure] = useState<MapFailure>('initialization')
 const [attempt, setAttempt] = useState(0)
 useEffect(() => { onSelectRef.current = onSelect }, [onSelect])
 const visits = getVisits(days,placeById)
 const viewRef=useRef({mode,expanded})
 viewRef.current={mode,expanded}
 function fitMap(){if(bounds.current&&host.current){const box=host.current.getBoundingClientRect();const desktop=typeof matchMedia==='function'?matchMedia('(min-width: 901px)').matches:box.width>800;const padding=mapPadding(box.width,box.height,viewRef.current.mode,viewRef.current.expanded,desktop)
  // Phone: the date card, map chips and list sheet float over the map, so fit markers into the gap actually left between them.
  if(!desktop){const bottomOf=(selector:string)=>{const r=document.querySelector(selector)?.getBoundingClientRect();return r&&r.height?r.bottom-box.top:0};const sheet=document.querySelector('.itinerary-panel')?.getBoundingClientRect();padding.top=Math.max(padding.top,bottomOf('.date-bar')+12,bottomOf('.map-toolbar')+12);if(sheet&&sheet.top<box.bottom&&sheet.top>box.top)padding.bottom=Math.max(32,box.bottom-sheet.top+16);if(box.height-padding.top-padding.bottom<80)padding.bottom=Math.max(32,box.height-padding.top-80)}
  map.current?.fitBounds(bounds.current,padding)}}
 const visitKey = JSON.stringify(visits.map(v => [v.label,v.place.id,v.place.name,v.place.position.lat,v.place.position.lng]))
 useEffect(() => {
  if (!googleMapsApiKey) return
  let cancelled = false
  const fail = (reason: MapFailure) => { if (!cancelled) { setFailure(reason); setState('error') } }
  const authError = () => fail('auth')
  window.addEventListener('tokyo-map-auth-error', authError)
  setState('loading')
  loadGoogleMaps(googleMapsApiKey).then(async () => {
   const [maps, core, marker] = await Promise.all([window.google!.maps.importLibrary('maps'), window.google!.maps.importLibrary('core'), window.google!.maps.importLibrary('marker')])
   if (cancelled || !host.current) return
   assertMapAuthorization()
   libraries.current = {maps, core, marker}
   map.current = new maps.Map(host.current, {center: {lat:35.68,lng:139.76}, zoom:11, mapId:'DEMO_MAP_ID', mapTypeControl:false, streetViewControl:false, fullscreenControl:false, gestureHandling:'cooperative', clickableIcons:false, zoomControl:true})
   assertMapAuthorization()
   setState('ready')
  }).catch(error => fail(error instanceof MapLoadError ? error.reason : 'initialization'))
  return () => {
   cancelled = true
   window.removeEventListener('tokyo-map-auth-error', authError)
   if (map.current) window.google?.maps.event?.clearInstanceListeners(map.current)
   map.current = null
   libraries.current = null
   bounds.current = null
  }
 }, [attempt])
 useEffect(() => {
  if (state !== 'ready' || !map.current || !libraries.current) return
  const {core, marker} = libraries.current
  const currentMap = map.current
  const views = new globalThis.Map<string, {marker: Marker; button: HTMLButtonElement}>()
  const unique = new globalThis.Map<string, {place: Place; labels: string[]}>()
  visits.forEach(v => { const value = unique.get(v.place.id); if (value) value.labels.push(v.label); else unique.set(v.place.id, {place:v.place,labels:[v.label]}) })
  try {
   const currentBounds = new core.LatLngBounds()
   const cityBounds = new core.LatLngBounds()
   let cityCount = 0
   unique.forEach(({place, labels}) => {
    const button = document.createElement('button')
    button.className = place.id === 'lodging' ? 'google-pin lodging-pin' : 'google-pin'
    button.textContent = place.id==='lodging'?'숙소':labels[0]
    button.title = place.name
    button.setAttribute('aria-label', place.id === 'lodging' ? '숙소 주소 구역 상세보기' : `${labels.join(', ')} ${place.name} 상세보기`)
    button.onclick = () => onSelectRef.current(place.id)
    const pin = new marker.AdvancedMarkerElement({map:currentMap, position:place.position, content:button, title:place.name})
    views.set(place.id, {marker:pin,button})
    currentBounds.extend(place.position)
    if (place.id !== 'narita') { cityBounds.extend(place.position); cityCount++ }
   })
   markerViews.current = views
   allBounds.current = currentBounds
   cityOnly.current = cityCount > 0 && cityCount < views.size ? cityBounds : null
   bounds.current = !withAirportRef.current && cityOnly.current ? cityOnly.current : currentBounds
   fitMap()
  } catch {
   views.forEach(v => v.marker.map = null)
   markerViews.current = new globalThis.Map()
   bounds.current = null
   setFailure('initialization'); setState('error')
  }
  return () => { views.forEach(v => v.marker.map = null); markerViews.current = new globalThis.Map() }
 // Include catalog coordinates and names so an API revision also refreshes pins and bounds.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [state, visitKey, attempt])
 useEffect(() => {
  markerViews.current.forEach(({marker,button},id) => { button.classList.toggle('is-selected', id === selected); marker.zIndex = id === selected ? 100 : 1 })
  if (selected && placeById[selected] && state === 'ready') map.current?.panTo(placeById[selected].position)
 }, [selected, state, visitKey])
 useEffect(() => {
  if (state !== 'ready' || !host.current || typeof ResizeObserver === 'undefined') return
  // fitBounds cannot work at display:none / zero size. Refit when a mobile map becomes visible.
  let frame = 0
  const observer = new ResizeObserver(entries => {
   if (!entries.some(e => e.contentRect.width > 0 && e.contentRect.height > 0)) return
   cancelAnimationFrame(frame)
   frame = requestAnimationFrame(() => { if (bounds.current) fitMap() })
  })
  observer.observe(host.current)
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
 }, [state])
 useEffect(()=>{if(state==='ready')fitMap()},[state,mode,expanded])
 const active = selected ? placeById[selected] : null
 const status = messages[failure]
 return <section className="map-panel" aria-label="날짜별 여행 지도" aria-busy={state==='loading'}>
  <div ref={host} className={`google-map ${state==='ready'?'visible':''}`} aria-label="Google 지도"/>
  {state==='ready'&&<div className="map-toolbar">{visits.some(v=>v.place.id==='narita')&&visits.some(v=>v.place.id!=='narita')&&<button className={`map-chip ${withAirport?'selected':''}`} aria-pressed={withAirport} onClick={()=>{const next=!withAirport;withAirportRef.current=next;setWithAirport(next);bounds.current=next||!cityOnly.current?allBounds.current:cityOnly.current;fitMap()}}>{withAirport?<><Plane size={15}/>도심 일정만 보기</>:<><span className="map-chip-num">{visits.find(v=>v.place.id==='narita')?.label}</span>나리타 공항 · 동쪽 약 60km · 함께 보기</>}</button>}<button className="icon-button" onClick={()=>{if(bounds.current)fitMap()}} aria-label="일정 동선 다시 맞추기"><Maximize2 size={16}/></button></div>}
  {state!=='ready'&&<div className="map-fallback"><div className="map-connection">
   <span className="connection-symbol"><MapPin size={24} strokeWidth={1.5}/></span>
   <h2>{state==='missing'?'Google 지도 연결 전입니다':state==='loading'?'Google 지도를 불러오는 중':status.title}</h2>
   <p>{state==='missing'?'일정과 길찾기는 바로 사용할 수 있습니다. 지도 연결은 아래 안내를 확인하세요.':state==='loading'?'지도 연결 중에도 일정과 장소 정보를 확인할 수 있습니다.':status.text}</p>
   {state==='error'&&<button className="secondary-button" onClick={()=>failure==='auth'?window.location.reload():setAttempt(v=>v+1)}><RotateCw size={14}/>{failure==='auth'?'새로고침':'다시 연결'}</button>}
   <details className="map-help"><summary>지도 연결 도움말 <ChevronRight size={13}/></summary><div><p>프로젝트 루트의 <code>.env</code> 또는 <code>.env.local</code>에 아래 변수 하나를 설정하고 개발 서버를 재시작하세요.</p><code className="env-example">VITE_GOOGLE_MAPS_API_KEY=발급받은_키</code><p><code>ERR_BLOCKED_BY_CLIENT</code>는 브라우저·확장 프로그램의 요청 차단을 뜻합니다. 지도 요청 도메인 <code>maps.googleapis.com</code>과 <code>maps.gstatic.com</code>의 차단 내역을 확인하세요. 진단용 요청 하나의 차단만으로 API 키 오류를 판단할 수는 없습니다.</p><p>인증 오류는 Console의 Google Maps 오류 코드로 구분합니다. 키 값이나 요청 URL 전체를 공유할 필요는 없습니다.</p><a href="https://developers.google.com/maps/documentation/javascript/error-messages" target="_blank" rel="noreferrer">Google 공식 오류 안내 <ExternalLink size={11}/></a></div></details>
  </div><div className="fallback-places"><h3>방문 장소 <span>{days.length===1?'첫 방문 순서':'날짜별 첫 방문 순서'}</span></h3><div className="route-diagram">{visits.map(v=><button key={v.label+v.place.id} className={`diagram-stop ${selected===v.place.id?'active':''}`} onClick={()=>onSelect(v.place.id)}><span className="diagram-number">{v.label}</span><strong>{v.place.name}</strong><ChevronRight size={14}/></button>)}</div></div></div>}
  {active&&state==='ready'&&<a className="map-active" href={searchUrl(active)} target="_blank" rel="noreferrer"><MapPin size={17}/><span><strong>{active.name}</strong><small>{active.address}</small></span><ExternalLink size={15}/></a>}
  <div className="map-footer"><span>{days.length===1?`12월 ${10+days[0].id}일`:'전체 여행'} · 방문 장소 {visits.filter(v=>v.place.id!=='lodging').length}곳 + 숙소</span><span>번호는 첫 방문 순서</span><span>{state==='ready'?'숙소는 주소 구역 대표점':'지도 미연결 · 장소 정보·길찾기 사용 가능'}</span></div>
 </section>
}

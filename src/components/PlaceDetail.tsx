import { useEffect, useRef } from 'react'
import { X, MapPin, Clock3, Ticket, ExternalLink, Footprints } from 'lucide-react'
import type { Place } from '../data/trip'
import { usePlaces } from '../hooks/PlaceCatalogContext'
import PlacePhoto from './PlacePhoto'
import { starWarsEntryNotice } from '../data/references'
import { directionsUrl, searchUrl } from '../lib/links'
export default function PlaceDetail({place,onClose}:{place:Place;onClose:()=>void}) {
 const placeById=usePlaces()
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[])
 const lodging=place.id==='lodging'
 const guide=place.guide
 return <dialog ref={ref} className="place-dialog" aria-labelledby="place-detail-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="detail-header"><span className="area-label">{lodging?'숙소 주소 구역':place.area}</span><button className="icon-button" onClick={onClose} aria-label="장소 상세 닫기"><X size={22}/></button></div>
  <h2 id="place-detail-title">{place.name}</h2><p className="detail-jp" lang="ja">{place.jp}</p>
  <PlacePhoto placeId={place.id}/>
  {guide&&<p className="detail-overview">{guide.overview}</p>}
  <div className="detail-actions detail-quick-actions"><a className="primary-button" href={directionsUrl(lodging?placeById.shinbashi:placeById.lodging,place,lodging?'walking':'transit')} target="_blank" rel="noreferrer">{lodging?'신바시역에서 도보 길찾기':'숙소에서 대중교통 길찾기'}<ExternalLink size={16}/></a><a className="secondary-button" href={searchUrl(place)} target="_blank" rel="noreferrer">지도에서 보기<ExternalLink size={16}/></a></div>
  <dl><div><dt><MapPin size={18}/>주소·위치</dt><dd lang="ja">{place.address}</dd><dd className="location-note">{place.positionNote}</dd></div><div><dt><Clock3 size={18}/>{lodging?'체크인·짐 보관':'운영시간'}</dt><dd>{place.hours}<small>자료 확인 {place.checkedAt} · 방문 전 재확인</small></dd></div><div><dt><Ticket size={18}/>입장·예약</dt><dd>{place.booking}</dd></div><div><dt>{lodging?'도착 전 확인':'방문 포인트'}</dt><dd>{place.experience}</dd></div></dl>
  {guide&&<>
   <section className="detail-section"><h3>이렇게 둘러보세요</h3><span className="detail-plan-label">방문 순서 제안 · 예약시간과 현장 상황에 따라 조정</span><ol className="detail-plan">{guide.visitPlan.map(item=><li key={item}>{item}</li>)}</ol></section>
   <section className="detail-section"><h3>가는 방법</h3><p>{guide.access}</p></section>
   <section className="detail-section"><h3>예산과 이용 조건</h3><p>{guide.budget}</p></section>
   <section className="detail-section"><h3>방문 전 알아두기</h3><ul className="detail-tips">{guide.tips.map(item=><li key={item}>{item}</li>)}</ul></section>
   <section className="detail-section"><h3>공식 자료로 다시 확인</h3><p className="detail-source-date">{guide.checkedAt} 자료 확인 · 12월 운영과 가격은 방문 전에 다시 확인하세요.</p><div className="detail-source-list">{guide.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={16}/></a>)}</div></section>
  </>}
  <div className="detail-actions"><a className="primary-button" href={searchUrl(place)} target="_blank" rel="noreferrer">{lodging?'숙소 주소를 Google Maps에서 보기':'Google Maps에서 보기'}<ExternalLink size={16}/></a>{lodging&&<a className="secondary-button" href={directionsUrl(placeById.shinbashi,place,'walking')} target="_blank" rel="noreferrer"><Footprints size={16}/>신바시역 → 숙소 구역</a>}<a className="secondary-button" href={place.url} target="_blank" rel="noreferrer">{lodging?'숙소 안내 페이지':'공식 안내'}<ExternalLink size={16}/></a></div>
  {place.id === 'starwars' && <a className="secondary-button" href={starWarsEntryNotice} target="_blank" rel="noreferrer">10/13 공식 입장 예약제 종료 안내<ExternalLink size={16}/></a>}
  <a className="source-link" href={place.coordinateSource} target="_blank" rel="noreferrer">좌표 자료 확인<ExternalLink size={14}/></a>
 </dialog>
}

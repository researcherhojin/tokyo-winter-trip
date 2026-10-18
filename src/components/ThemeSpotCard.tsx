import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Bookmark, Check, ChevronRight, MapPin, X } from 'lucide-react'
import { areaLabel, tripClosuresFor } from '../lib/spotFacts'
import { themeMapUrl } from '../data/themes'
import type { Reference, ThemeSpot } from '../data/themes'
import { usePlaces } from '../hooks/PlaceCatalogContext'
import ThemeImage, { ThemeGallery } from './ThemeImage'
import { cardPhotoOrder, photoGap, themePhotoId, themeReferencePhotoId } from '../lib/themePhoto'
import { visitorInfoFor } from '../data/visitorInfo'
export function References({items}: {items: Reference[]}) {
 const unique=[...new Map(items.map(item=>[item.url,item])).values()]
 if(!unique.length)return null
 return <details className="theme-references"><summary>출처·확인 범위 <span>{unique.length}개 링크</span></summary><div>{unique.map(item => <div key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<ArrowUpRight size={14}/></a>{item.note && <p>{item.note}</p>}</div>)}</div></details>
}
/** 운영시간·휴무 text in at most two lines, split at the " · " and " / " separators instead of wrapping mid-phrase. */
const closedLines=(text:string)=>{const parts=text.split(/ · | \/ /);return parts.length>2?[parts[0],parts.slice(1).join(' · ')]:parts}
/** Label-tile name: the Japanese product/shop name when it has kana, otherwise the Korean name, without (후보)·(현행) notes. */
const labelName=(name:string)=>{const [ko,ja]=name.split(' · ');return (ja&&/[\u3040-\u30ff]/.test(ja)?ja:ko).replace(/\((후보|현행)\)/g,'').trim()}
/** Full visit facts, notes and sources for one card, kept out of the card body so cards stay compact. */
function InfoDialog({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const dialog=ref.current;const trigger=document.activeElement as HTMLElement|null;dialog?.showModal();return()=>{dialog?.close();trigger?.focus({preventScroll:true})}},[])
 return <dialog ref={ref} className="theme-card-detail" aria-label={title+' 방문 정보·출처'} onCancel={event=>{event.preventDefault();onClose()}} onClick={event=>{if(event.target===event.currentTarget)onClose()}}>
  <header><div><span>방문 정보·출처</span><h3>{title}</h3></div><button onClick={onClose} aria-label="방문 정보 닫기"><X size={20}/></button></header>
  <div className="theme-card-detail-body">{children}</div>
 </dialog>
}
/** Google Images results for a candidate with no reusable photo: opened in a new tab, never copied into the app. */
const imageSearchUrl=(spot:ThemeSpot)=>'https://www.google.com/search?tbm=isch&q='+encodeURIComponent([labelName(spot.name),spot.address.split(' · ')[0]].join(' '))
// Card facts drop parenthetical detail; the dialog keeps the full text.
const cardFact=(line:string)=>line.replace(/\s*\([^)]*\)/g,'').trim()||line
export default function SpotCard({spot,saved,onSave,onPlace,themeReferences,nightOnly=false}: {spot:ThemeSpot;nightOnly?:boolean;saved:boolean;onSave:()=>void;onPlace:(id:string)=>void;themeReferences?:Reference[]}) {
 const placeById=usePlaces()
 const [showInfo,setInfo]=useState(false)
 const evidence=spot.evidence
 const official = spot.placeId ? placeById[spot.placeId] : undefined
 const refs = spot.references ?? (spot.officialUrl ? [{title:'시설·매장 안내',url:spot.officialUrl}] : official ? [{title:'장소 공식 안내',url:official.url}] : themeReferences??[])
 const photoId = themePhotoId(spot)
 const gap = photoGap(spot)
 const referenceId = themeReferencePhotoId(spot)
 const mediaIds = photoId ? cardPhotoOrder([photoId,...(spot.photoIds??[]).filter(id=>id!==photoId)],nightOnly) : referenceId ? [referenceId] : []
 const kind = spot.kind ?? 'place'
 const info=visitorInfoFor(spot)
 const status = kind === 'product' ? '상품 관심 목록' : kind === 'unresolved' ? '정확한 장소 확인 필요' : official ? '기존 일정' : spot.verified ? '공식 정보 확인' : '방문 후보'
 const area = areaLabel(spot)
 const closures = tripClosuresFor(spot)
 const summary = evidence?.summary??spot.note
 const lead = summary.match(/^.+?[다요]\.(?=\s|$)/)?.[0]??summary
 const warning = evidence?.highlight&&!(closures.length&&/휴무|휴관/.test(evidence.highlight))?evidence.highlight:undefined
 const productCheck = spot.id.startsWith('seven')||spot.id.startsWith('lawson')||spot.id==='mcdonalds-burger'||spot.id==='cooler-bag'?'점포별 재고·판매 기간 확인':'포장 제품명·사용 조건을 약사에게 확인'
 const overlay = <div className="theme-spot-top"><span className="booking-status">{status}</span><button className={saved?'saved':''} onClick={onSave} title={saved?'저장 해제':'저장'} aria-pressed={saved} aria-label={spot.name+' '+(saved?'저장 해제':'저장')}>{saved?<Check size={16}/>:<Bookmark size={16}/>}</button></div>
 return <article className={`theme-spot ${photoId?'has-photo':'without-photo'} ${referenceId?'has-reference':''}`} data-spot={spot.id}>
  <div className="theme-spot-media">{mediaIds.length ? <ThemeGallery key={mediaIds.join()} photoIds={mediaIds} overlay={overlay}/>:gap&&<div className="theme-photo-missing"><div className="theme-gallery-frame">{overlay}<span className="theme-label-body"><strong>{labelName(spot.name)}</strong><span className="theme-label-maker">{spot.address.split(' · ')[0]}</span></span><span className="theme-label-links">{evidence?.photoPageUrl&&<a href={evidence.photoPageUrl} target="_blank" rel="noreferrer">공식 사진<ArrowUpRight size={14}/></a>}<a href={imageSearchUrl(spot)} target="_blank" rel="noreferrer" aria-label={spot.name+' 이미지 검색(Google)'}>이미지 검색<ArrowUpRight size={14}/></a></span></div><p title={gap.detail}>사진 · {gap.title}</p></div>}</div>
  <div className="theme-spot-head"><h3>{spot.name}</h3>{area&&<p className="theme-spot-area"><MapPin size={14} aria-hidden="true"/><span>{area}</span></p>}</div>
  <p className="theme-card-note">{lead}</p>
  <div className="theme-spot-facts"><dl className="theme-visit-info">{kind==='product'?<><div><dt>제조·판매</dt><dd>{spot.address}</dd></div><div><dt>구매 전</dt><dd>{productCheck}</dd></div></>:<><div><dt>운영시간</dt><dd className="theme-closed-lines" title={info.hours}>{closedLines(info.hours).map(line=><span key={line}>{cardFact(line)}</span>)}</dd></div><div><dt>휴무</dt><dd className="theme-closed-lines" title={info.closed}>{closedLines(info.closed).map(line=><span key={line}>{cardFact(line)}</span>)}</dd></div></>}</dl>
</div>
  <div className="theme-spot-foot">{kind==='place' && spot.query && <div className="theme-actions"><a href={themeMapUrl(spot)} target="_blank" rel="noreferrer">지도·리뷰<ArrowUpRight size={16}/></a><a href={themeMapUrl(spot,true)} target="_blank" rel="noreferrer">길찾기<ArrowUpRight size={16}/></a></div>}
  {kind==='unresolved' && <p className="small-note">장소가 확인되면 길찾기를 연결합니다.</p>}</div>
  <button className="theme-card-detail-open" onClick={()=>setInfo(true)} aria-haspopup="dialog">방문 정보·출처<ChevronRight size={16} aria-hidden="true"/></button>
  {showInfo&&<InfoDialog title={spot.name} onClose={()=>setInfo(false)}>
   <div className="theme-visit-source"><span>{info.checkedAt} 확인</span>{info.sourceUrl&&<a href={info.sourceUrl} target="_blank" rel="noreferrer">공식 운영 안내<ArrowUpRight size={14}/></a>}</div>
   {summary!==lead&&<p>{summary}</p>}<dl className="theme-info-list"><div><dt>운영시간</dt><dd>{info.hours}</dd></div><div><dt>휴무</dt><dd>{info.closed}</dd></div>{closures.length>0&&<div><dt>여행 중 휴무</dt><dd>{closures.map(item=>`${item.date}(${item.day}) ${item.label}`).join(' · ')}</dd></div>}<div><dt>입장·이용</dt><dd>{info.admission}</dd></div><div><dt>주소</dt><dd>{spot.address}</dd></div></dl>{warning&&<p className="theme-visit-restriction">{warning}</p>}{info.note&&<p>{info.note}</p>}{spot.images&&<small>{spot.images}</small>}<p>{spot.note}</p>{spot.details&&<p>{spot.details}</p>}
  {!photoId && !!spot.photoIds?.length && <details className="theme-details"><summary>주변 참고 사진</summary>{spot.photoIds.map(id=><ThemeImage key={id} photoId={id}/>)}</details>}

   {evidence&&<details className="theme-details theme-verification"><summary>공식 자료·확인 범위</summary><div className="official-evidence"><span>{evidence.officialUrl?'공식 자료 확인':'장소·제품 식별 필요'}</span>{evidence.photoPageUrl?<a href={evidence.photoPageUrl} target="_blank" rel="noreferrer">사진 원문<ArrowUpRight size={14}/></a>:!photoId&&<small>해당 장소·제품의 공식 사진 확인 필요</small>}<details><summary>확인 범위 · {evidence.checkedAt}</summary><p>{evidence.verificationNote}</p><p>{evidence.photoNote}</p>{evidence.officialUrl&&<a href={evidence.officialUrl} target="_blank" rel="noreferrer">공식 안내 원문<ArrowUpRight size={14}/></a>}</details></div></details>}
   {official&&<button className="secondary-button theme-place-preview" onClick={()=>{setInfo(false);onPlace(spot.placeId!)}} aria-label={spot.name+' 사진과 상세보기'}>예약·장소 상세<ArrowUpRight size={16}/></button>}
   {refs.length>0?<References items={refs}/>:<p className="reference-pending">공유 본문 기준 · 원문 링크 미제공</p>}
  </InfoDialog>}
 </article>
}

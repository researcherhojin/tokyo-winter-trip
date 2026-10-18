import { useCallback,useEffect,useRef,useState } from 'react'
import type { KeyboardEvent,ReactNode } from 'react'
import { ChevronLeft,ChevronRight,Expand,X } from 'lucide-react'
import { photoById,photoMode } from '../lib/photos'
import { PhotoCredit } from './PlacePhoto'

const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches
const EXIT_MS=180

/** The trigger regains focus after close(); close() alone would restore whatever was focused before showModal. Multi-photo places page with arrows, ←/→ keys or a swipe, each photo with its own caption. */
function FullPhoto({photoIds,start,trigger,onClose}:{photoIds:string[];start:number;trigger:HTMLElement|null;onClose:(index:number)=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 const closing=useRef(false)
 const touchX=useRef<number|null>(null)
 const [index,setIndex]=useState(start)
 const photoId=photoIds[index]
 const photo=photoById[photoId]
 const many=photoIds.length>1
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>{dialog?.close();trigger?.focus({preventScroll:true})}},[trigger])
 /** Plays the exit transition before unmounting; Escape and backdrop clicks share the same path. */
 const close=useCallback(()=>{
  const dialog=ref.current
  if(!dialog||closing.current)return
  if(reducedMotion())return onClose(index)
  closing.current=true;dialog.classList.add('is-closing')
  window.setTimeout(()=>onClose(index),EXIT_MS)
 },[onClose,index])
 const go=(next:number)=>setIndex(Math.max(0,Math.min(photoIds.length-1,next)))
 const keys=(event:KeyboardEvent)=>{if(!many)return;if(event.key==='ArrowRight'){event.preventDefault();go(index+1)}if(event.key==='ArrowLeft'){event.preventDefault();go(index-1)}}
 return <dialog ref={ref} className="theme-photo-dialog" aria-label={photo.alt+' 원본 비율 보기'} onKeyDown={keys} onCancel={event=>{event.preventDefault();close()}} onClick={event=>{if(event.target===event.currentTarget)close()}}>
  <div className="theme-photo-dialog-heading"><span>사진 크게 보기{many&&<span className="theme-photo-count"> · {index+1} / {photoIds.length}</span>}</span><button onClick={close} aria-label="사진 크게 보기 닫기"><X size={22}/></button></div>
  <div className="theme-photo-stage" onTouchStart={event=>{touchX.current=event.touches[0].clientX}} onTouchEnd={event=>{const startX=touchX.current;touchX.current=null;if(startX===null||!many)return;const dx=event.changedTouches[0].clientX-startX;if(Math.abs(dx)>48)go(index+(dx<0?1:-1))}}>
   <img key={photoId} src={photo.src} alt={photo.alt}/>
   {many&&<>
    <button className="dialog-nav dialog-prev" onClick={()=>go(index-1)} disabled={index===0} aria-label="이전 사진"><ChevronLeft size={22}/></button>
    <button className="dialog-nav dialog-next" onClick={()=>go(index+1)} disabled={index>=photoIds.length-1} aria-label="다음 사진"><ChevronRight size={22}/></button>
   </>}
  </div>
  {many&&<span className="sr-only" aria-live="polite">{photoIds.length}장 중 {index+1}번째 사진 · {photo.caption}</span>}
  <div className="theme-photo-dialog-caption">{photo.reference&&<p className="photo-reference-note"><strong>{photo.reference.label}</strong> · {photo.reference.difference}</p>}<p className="photo-dialog-title">{photo.caption}</p><PhotoCredit placeId={photoId} photoId={photoId} qualifier={false}/></div>
 </dialog>
}

/** One 4:3 frame. Whole-mode photos keep their full composition over a blurred fill instead of being cropped. */
function PhotoSlide({photoId,onOpen,children}:{photoId:string;onOpen:(trigger:HTMLButtonElement)=>void;children?:ReactNode}){
 const photo=photoById[photoId]
 const image=useRef<HTMLImageElement>(null)
 const [loaded,setLoaded]=useState(false)
 const [failed,setFailed]=useState(false)
 useEffect(()=>{const img=image.current;if(img?.complete&&img.naturalWidth)setLoaded(true)},[photoId])
 if(failed)return <div className="photo-slide photo-slide-failed">사진을 불러오지 못했습니다. <a href={photo.source} target="_blank" rel="noreferrer">원본 사진에서 확인</a></div>
 const mode=photoMode(photo)
 const position=`${photo.focus?.x??50}% ${photo.focus?.y??50}%`
 return <div className={`photo-slide photo-${mode} ${loaded?'is-loaded':''}`} data-photo-id={photoId} data-photo-mode={mode} data-time-of-day={photo.timeOfDay}>
  <button className="theme-image-open" aria-label={photo.alt+' 사진 크게 보기'} onClick={event=>onOpen(event.currentTarget)}>
   {mode==='whole'&&<img className="photo-fill" src={photo.src} alt="" aria-hidden="true" decoding="async" loading="lazy"/>}
   <img ref={image} className="photo-main" src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width={photo.width??960} height={photo.height??720} style={{objectPosition:position}} onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)}/>
   <span className="theme-image-expand"><Expand size={16}/><span>전체 사진</span></span>
  </button>
  {children}
 </div>
}

function PhotoInfo({photoId,compact}:{photoId:string;compact:boolean}){
 const photo=photoById[photoId]
 return <figcaption>{!compact&&<span>{photo.caption}</span>}<details className="theme-image-source"><summary>{compact?<span className="photo-credit-line">사진 © {photo.author||'Wikimedia Commons'} · {photo.license}</span>:'사진 출처·촬영 범위'}</summary>{compact&&<p>{photo.caption}</p>}{photo.reference&&<p>{photo.reference.difference}</p>}<PhotoCredit placeId={photoId}/></details></figcaption>
}

/** Airbnb-style card media: snap carousel with dots, overlaid controls and a photo-level reference badge. */
export function ThemeGallery({photoIds,overlay}:{photoIds:string[];overlay?:ReactNode}){
 const ids=photoIds.filter(id=>photoById[id])
 const track=useRef<HTMLDivElement>(null)
 const [index,setIndex]=useState(0)
 const [open,setOpen]=useState<string>()
 const trigger=useRef<HTMLButtonElement|null>(null)
 const onScroll=useCallback(()=>{const el=track.current;if(el)setIndex(Math.round(el.scrollLeft/Math.max(1,el.clientWidth)))},[])
 const go=(next:number)=>{const el=track.current;if(!el)return;const target=Math.max(0,Math.min(ids.length-1,next));el.scrollTo({left:target*el.clientWidth,behavior:reducedMotion()?'auto':'smooth'})}
 const keys=(event:KeyboardEvent)=>{if(ids.length<2)return;if(event.key==='ArrowRight'){event.preventDefault();go(index+1)}if(event.key==='ArrowLeft'){event.preventDefault();go(index-1)}}
 const close=useCallback((viewed:number)=>{setOpen(undefined);const el=track.current;if(el)el.scrollTo({left:viewed*el.clientWidth})},[])
 if(!ids.length)return null
 const current=photoById[ids[Math.min(index,ids.length-1)]]
 return <figure className="theme-image theme-gallery" data-photo-id={ids[0]} data-time-of-day={photoById[ids[0]].timeOfDay} onKeyDown={keys}>
  <div className="theme-gallery-frame">
   <div ref={track} className="theme-gallery-track" onScroll={onScroll}>
    {ids.map(id=><PhotoSlide key={id} photoId={id} onOpen={element=>{trigger.current=element;setOpen(id)}}/>)}
   </div>
   {overlay}
   {current.reference&&<span className="photo-reference-badge">{current.reference.label}</span>}
   {ids.length>1&&<>
    <button className="gallery-nav gallery-prev" onClick={()=>go(index-1)} disabled={index===0} aria-label="이전 사진"><ChevronLeft size={18}/></button>
    <button className="gallery-nav gallery-next" onClick={()=>go(index+1)} disabled={index>=ids.length-1} aria-label="다음 사진"><ChevronRight size={18}/></button>
    <div className="gallery-dots" aria-hidden="true">{ids.map((id,i)=><span key={id} className={i===index?'active':''}/>)}</div>
   </>}
  </div>
  <PhotoInfo key={ids[index]??ids[0]} photoId={ids[Math.min(index,ids.length-1)]} compact/>
  {ids.length>1&&<span className="sr-only" aria-live="polite">{ids.length}장 중 {Math.min(index,ids.length-1)+1}번째 사진</span>}
  {open&&<FullPhoto photoIds={ids} start={Math.max(0,ids.indexOf(open))} trigger={trigger.current} onClose={close}/>}
 </figure>
}

/** Single framed photo for theme covers and secondary lists. */
export default function ThemeImage({photoId,cover=false,compact=false}:{photoId:string;cover?:boolean;compact?:boolean}){
 const [open,setOpen]=useState(false)
 const trigger=useRef<HTMLButtonElement|null>(null)
 const close=useCallback(()=>setOpen(false),[])
 const photo=photoById[photoId]
 if(!photo)return null
 return <figure className={`theme-image ${cover?'theme-image-cover':'theme-image-view'} ${compact?'theme-image-compact':''}`} data-photo-id={photoId} data-time-of-day={photo.timeOfDay}>
  <div className="theme-gallery-frame"><PhotoSlide photoId={photoId} onOpen={element=>{trigger.current=element;setOpen(true)}}/>{photo.reference&&<span className="photo-reference-badge">{photo.reference.label}</span>}</div>
  {!cover&&<PhotoInfo photoId={photoId} compact={compact}/>}
  {open&&<FullPhoto photoIds={[photoId]} start={0} trigger={trigger.current} onClose={close}/>}
 </figure>
}

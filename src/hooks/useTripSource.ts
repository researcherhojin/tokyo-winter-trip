import { useEffect, useState } from 'react'
import { useTripCatalog } from './useCatalog'
import { applyLiveTrip, isLiveTrip } from '../lib/liveTrip'
import { anchorReservations } from '../lib/reservationAnchors'
import type { LiveTrip } from '../../server/notion'
export default function useTripSource(){
 const {data:catalog,status:catalogStatus}=useTripCatalog()
 const initialDays=catalog.days
 const [live,setLive]=useState<LiveTrip|null>(null)
 const [stale,setStale]=useState(false)
 useEffect(()=>{
  let active=true;let busy=false;let controller:AbortController|undefined
  async function refresh(){
   if(busy||document.visibilityState==='hidden')return
   busy=true;controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),15000)
   try{
    const response=await fetch('/api/trip',{signal:controller.signal,cache:'no-store'})
    // Vite serves index.html for unknown routes; a static deployment remains fully usable.
    if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Sync unavailable')
    if(!response.ok)throw Error('Sync unavailable')
    const value:unknown=await response.json()
    if(isLiveTrip(value)){if(active){setLive(value);setStale(false)}}
    else if(value&&typeof value==='object'&&'enabled' in value&&value.enabled===false){if(active){setLive(null);setStale(false)}}
    else throw Error('Invalid schedule')
   }catch{if(active)setStale(true)}finally{clearTimeout(timeout);busy=false}
  }
  void refresh();const interval=setInterval(()=>void refresh(),60000)
  const focus=()=>void refresh();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus)
  return()=>{active=false;controller?.abort();clearInterval(interval);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)}
 },[])
 return {places:catalog.places,catalogStatus,days:anchorReservations(live?applyLiveTrip(initialDays,live):initialDays),sourceLabel:live?`Notion 자동 반영 · ${new Date(live.lastEditedAt).toLocaleString('ko-KR',{timeZone:'Asia/Tokyo',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})} JST${stale?' · 갱신 지연':''}`:stale?'기본 일정 · Notion 연결 확인 필요':'기본 일정 · 이동시간은 계획값'}
}

import { useEffect, useState } from 'react'
import type { CatalogData, CatalogResource } from '../shared/catalogContract'
import { days, places } from '../data/trip'
import { fetchCatalog } from '../lib/catalogClient'

export type CatalogStatus = 'loading'|'remote'|'fallback'
/** Shows the bundled `baseline` at once and replaces it only with a validated server reply. */
export function useCatalog<K extends CatalogResource>(resource: K, baseline: CatalogData<K>) {
 const [data,setData] = useState<CatalogData<K>>(baseline)
 const [status,setStatus] = useState<CatalogStatus>('loading')
 useEffect(()=>{
  let active=true
  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),10000)
  void fetchCatalog(resource,baseline,controller.signal).then(value=>{if(active){setData(value);setStatus('remote')}}).catch(()=>{if(active)setStatus('fallback')}).finally(()=>clearTimeout(timeout))
  return ()=>{active=false;clearTimeout(timeout);controller.abort()}
 },[resource,baseline])
 return {data,status,message:status==='fallback'?'서버 자료를 받지 못해 앱에 포함된 기본 자료를 표시합니다.':status==='remote'?'여행 자료 API 연결됨':'여행 자료 확인 중'}
}
const tripBaseline={days,places}
export const useTripCatalog=()=>useCatalog('trip',tripBaseline)

import { useEffect,useState } from 'react'
import { progressKey,readProgress } from '../lib/travelProgress'
import type { VisitState } from '../lib/travelProgress'
export default function useTravelProgress(){
 const [progress,setProgress]=useState(readProgress)
 const [message,setMessage]=useState('')
 useEffect(()=>{const onStorage=(event:StorageEvent)=>{if(event.key===progressKey)setProgress(readProgress())};window.addEventListener('storage',onStorage);return()=>window.removeEventListener('storage',onStorage)},[])
 function update(key:string,state:VisitState){const next={...progress,[key]:state};setProgress(next);try{localStorage.setItem(progressKey,JSON.stringify(next));setMessage('방문 상태를 이 기기에 저장했습니다.')}catch{setMessage('저장이 제한되어 이번 화면에서만 유지됩니다.')}}
 return {progress,update,message}
}

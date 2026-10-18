import { useEffect, useState } from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { exchangeEndpoint, parseYenRate } from '../lib/exchange'
import type { YenRate } from '../lib/exchange'

let cached: {value: YenRate; fetched: number} | undefined
export default function YenExchange() {
 const [rate,setRate]=useState<YenRate|null>(cached?.value??null)
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState('')
 const [attempt,setAttempt]=useState(0)
 const [amount,setAmount]=useState('10000')
 useEffect(()=>{
  if(!attempt&&cached&&Date.now()-cached.fetched<3600000)return
  const controller=new AbortController()
  let active=true
  const timeout=setTimeout(()=>controller.abort(),10000)
  setLoading(true);setError('')
  fetch(exchangeEndpoint,{signal:controller.signal}).then(response=>{if(!response.ok)throw Error();return response.json()}).then(parseYenRate).then(value=>{if(active){cached={value,fetched:Date.now()};setRate(value)}}).catch(()=>{if(active)setError('환율을 불러오지 못했습니다. 잠시 후 다시 조회하세요.')}).finally(()=>{clearTimeout(timeout);if(active)setLoading(false)})
  return()=>{active=false;clearTimeout(timeout);controller.abort()}
 },[attempt])
 const stale=rate&&Date.now()-Date.parse(rate.date)>7*86400000
 const yen=Number(amount)
 const won=(value:number)=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:2}).format(value)
 return <section className="yen-exchange" aria-label="엔화 환율"><div className="exchange-heading"><h2>엔화 환율</h2><button className="icon-button" aria-label="엔화 환율 새로고침" disabled={loading} onClick={()=>setAttempt(value=>value+1)}><RefreshCw size={18}/></button></div><div role="status">{rate?<><p className="exchange-rate"><span>100엔</span><strong>{won(rate.rate*100)}<small>원</small></strong></p><p className="small-note">{rate.date} 기준 · {error?'이전 조회값':'일별 참고 환율'}{stale?' · 오래된 자료, 최신 기준일 확인 필요':''}</p></>:<p className="muted">{loading?'참고 환율 조회 중…':'환율 조회 전'}</p>}{error&&<p className="small-note">{error}</p>}</div><label className="exchange-amount">여행 경비 환산<span><input type="number" inputMode="numeric" min="0" max="100000000" step="100" value={amount} onChange={event=>setAmount(event.target.value)} aria-label="환산할 엔화 금액"/>엔</span></label><output className="exchange-total">{rate&&amount!==''&&Number.isFinite(yen)&&yen>=0&&yen<=100000000?`약 ${won(yen*rate.rate)}원`:'엔화 금액을 입력하세요'}</output><p className="small-note">일중 실시간 시세가 아닙니다. 은행의 현찰 살 때 환율·수수료·우대율에 따라 실제 환전 금액이 달라집니다. 휴일에는 최근 발표일 기준입니다.</p><a className="source-link" href="https://frankfurter.dev/" target="_blank" rel="noreferrer">Frankfurter · 환율 출처<ExternalLink size={14}/></a></section>
}

import { ArrowRight,ArrowUpRight,ChevronDown,CircleAlert,ListOrdered,NotebookPen } from 'lucide-react'
import type { Stop } from '../data/trip'
/** Visit guide: ordered steps, pre-visit checks, the hand-off to the next stop, the memo and its sources, each as its own labeled block. */
export default function StopGuide({stop}:{stop:Stop}){
 const guide=stop.guide
 return <details className="stop-details"><summary><span>{guide?'방문 가이드':'일정 메모'}</span>{guide&&<small>{guide.steps.length}단계 · 확인 {guide.checks.length}개</small>}<ChevronDown size={16} aria-hidden="true"/></summary>
  <div className="stop-guide-panel">
   {guide&&<div className="stop-guide">
    <section className="guide-steps"><h3><ListOrdered size={15} aria-hidden="true"/>진행 순서</h3><ol>{guide.steps.map(step=><li key={step}>{step}</li>)}</ol></section>
    <section className="guide-checks"><h3><CircleAlert size={15} aria-hidden="true"/>가기 전에 확인</h3><ul>{guide.checks.map(check=><li key={check}>{check}</li>)}</ul></section>
    <section className="guide-next"><h3><ArrowRight size={15} aria-hidden="true"/>다음 이동</h3><p>{guide.next}</p></section>
   </div>}
   <section className="guide-memo">{guide&&<h3><NotebookPen size={15} aria-hidden="true"/>메모</h3>}<p className="stop-note">{stop.note}</p></section>
   {guide&&<div className="stop-guide-sources"><span>자료 확인 {guide.checkedAt} · 체류·이동 시간은 계획값</span><div>{guide.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14}/></a>)}</div></div>}
  </div>
 </details>
}

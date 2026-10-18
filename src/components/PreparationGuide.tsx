import { CreditCard, ExternalLink } from 'lucide-react'
import { suicaGuide, preparationSources, yoyogiSpot } from '../data/preparation'
import type { CatalogData } from '../shared/catalogContract'

export function YoyogiCandidate({spot=yoyogiSpot}:{spot?:typeof yoyogiSpot}) {
 return <aside className="saved-spot"><span className="booking-status">방문 후보 · 위치 확인 필요</span><h3>{spot.title}</h3><p>{spot.description}</p><p>{spot.note}</p><a className="secondary-button" href={spot.url} target="_blank" rel="noreferrer">주변 위치 검색<ExternalLink size={16}/></a></aside>
}

export default function PreparationGuide({data}:{data?:CatalogData<'preparation'>}) {
 const guide=data?.suicaGuide??suicaGuide
 const sources=data?.preparationSources??preparationSources
 return <section className="preparation-guide" aria-label="교통카드 안내"><details><summary><span className="prep-tool-icon" aria-hidden="true"><CreditCard size={16}/></span><span>Suica 준비 가이드</span></summary><p className="small-note">2026.10.17 공식 안내 확인 · 기기별 지원·결제 조건은 출발 전 재확인</p>{guide.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}<nav aria-label="Suica 공식 안내">{sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={14}/></a>)}</nav></details></section>
}

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Bookmark, BookOpen, ChevronDown, Search, ChevronRight, Star, TriangleAlert } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import { travelThemes as bundledThemes } from '../data/themes'
import ThemeImage from './ThemeImage'
import { photoById } from '../lib/photos'
import { consolidateThemes, normalizeThemeSaves, sortThemeEntries } from '../lib/themeOrganization'
import type { ThemeSort } from '../lib/themeOrganization'
import SpotCard from './ThemeSpotCard'

const storageKey = 'tokyo-2026-theme-saves-v1'
const themesBaseline = {themes:bundledThemes}
/** Themes whose candidates are best compared by live Google Maps ratings; the app itself does not collect ratings. */
const ratingSearch:Record<string,{label:string;query:string}>={food:{label:'식당',query:'東京 レストラン'},desserts:{label:'카페·디저트',query:'東京 カフェ スイーツ'}}
const themeGroups=[
 {title:'12월 시즌',ids:['december-tokyo','night-view']},
 {title:'도시 산책',ids:['tower-photos','architecture','city-interests','rail-photo']},
 {title:'취향 탐방',ids:['subculture','anime-places']},
 {title:'먹거리',ids:['food','desserts','convenience']},
 {title:'쇼핑·근교',ids:['pharmacy','day-trips']},
]
function readSaved(): string[] {
 try {
  const value = JSON.parse(localStorage.getItem(storageKey) || '[]')
  return Array.isArray(value) ? normalizeThemeSaves(value.filter(id => typeof id === 'string')) : []
 } catch { return [] }
}
export default function ThemeExplorer({onPlace}:{onPlace:(id:string)=>void}) {
 const {data,status} = useCatalog('themes',themesBaseline)
 const travelThemes=consolidateThemes(data.themes)
 const entries=travelThemes.flatMap(theme=>theme.spots.map(spot=>({spot,theme})))
 const [themeId,setThemeId] = useState(()=>themeGroups[0].ids.find(id=>travelThemes.some(item=>item.id===id))??travelThemes[0].id)
 const tabs = useRef<HTMLElement>(null)
 /** Keep the selected theme visible inside the horizontally scrolling mobile menu without moving the page. */
 useEffect(()=>{const nav=tabs.current;const selected=nav?.querySelector<HTMLElement>('button.selected');if(!nav||!selected||nav.scrollWidth<=nav.clientWidth)return;nav.scrollLeft=selected.offsetLeft-nav.offsetLeft-(nav.clientWidth-selected.offsetWidth)/2},[themeId])
 const [saved,setSaved] = useState(readSaved)
 const [message,setMessage] = useState('')
 const [query,setQuery] = useState('')
 const [savedOnly,setSavedOnly] = useState(false)
 const [sort,setSort] = useState<ThemeSort>('name')
 const [panel,setPanel] = useState<'caution'|'refs'|null>(null)
 const theme = travelThemes.find(item=>item.id===themeId)??travelThemes[0]
 const themeRefs = [...new Map((theme.references??[]).map(item=>[item.url,item])).values()]
 /** Only a verified cover is shown; otherwise an empty slot of the same size keeps the header frame identical. */
 const coverId = theme.coverPhotoId
 const filtering = savedOnly || query.trim().length>0
 const search = query.trim().toLocaleLowerCase()
 const visible = sortThemeEntries((filtering?entries:entries.filter(item=>item.theme.id===theme.id)).filter(({spot,theme})=>(!savedOnly||saved.includes(spot.id))&&(!search||[spot.name,spot.address,spot.note,theme.title].join(' ').toLocaleLowerCase().includes(search))),sort)
 function renderSpot({spot,theme:sourceTheme}:(typeof entries)[number]){return <div key={spot.id}>{filtering&&<p className="search-theme-name">{sourceTheme.title}</p>}<SpotCard spot={spot} nightOnly={sourceTheme.id==='night-view'} saved={saved.includes(spot.id)} onSave={()=>toggle(spot.id)} onPlace={onPlace} themeReferences={sourceTheme.references}/></div>}
 function toggle(id:string) {
  const next = saved.includes(id)?saved.filter(item=>item!==id):[...saved,id]
  setSaved(next)
  try {localStorage.setItem(storageKey,JSON.stringify(next));setMessage('이 기기에 저장했습니다.')}
  catch {setMessage('브라우저 저장이 제한되어 이번 화면에서만 유지됩니다.')}
 }
 function selectTheme(id:string){setThemeId(id);setPanel(null);setQuery('');setSavedOnly(false);window.scrollTo({top:0,behavior:typeof matchMedia==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'})}
 return <section className="theme-page">
  <div className="theme-workspace">
   <aside className="theme-sidebar" aria-label="테마 선택과 검색">
    <div className="theme-sidebar-heading"><h1>테마 탐색</h1><span>{travelThemes.length}개 테마</span></div>
    <div className="theme-tools"><label className="theme-search"><Search size={18}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="장소·먹거리 검색" aria-label="전체 테마 검색"/></label><button className={savedOnly?'selected':''} aria-pressed={savedOnly} onClick={()=>setSavedOnly(value=>!value)}><Bookmark size={16}/>저장한 항목 <span>{saved.length}</span></button></div>
    <nav ref={tabs} className="theme-tabs" aria-label="여행 테마">{[...themeGroups,{title:'다른 테마',ids:travelThemes.filter(item=>!themeGroups.some(group=>group.ids.includes(item.id))).map(item=>item.id)}].filter(group=>group.ids.some(id=>travelThemes.some(item=>item.id===id))).map(group=><div className="theme-nav-group" key={group.title}><span className="theme-nav-group-title">{group.title}</span>{group.ids.flatMap(id=>travelThemes.filter(item=>item.id===id)).map(item=><button key={item.id} className={item.id===theme.id&&!filtering?'selected':''} aria-pressed={item.id===theme.id&&!filtering} onClick={()=>selectTheme(item.id)}><span>{item.title}</span><small>{item.spots.length}</small><ChevronRight size={14}/></button>)}</div>)}</nav>
    <p className="theme-sidebar-note">마음에 드는 곳을 저장해 두세요.<br/>여행 일정에는 자동으로 추가되지 않습니다.</p>
   </aside>
   <div className="theme-content">
  <div className="theme-content-bar"><span>{filtering?(savedOnly?'저장한 항목':'검색 결과'):'가보고 싶은 도쿄'}</span><span>{visible.length}개 항목</span></div>
  <div className="theme-content-body">
  {filtering?<div className="theme-results-heading"><h2>{savedOnly?'저장한 항목':'전체 테마 검색'}</h2></div>:<div className="theme-intro"><div className="theme-intro-text"><h2>{theme.title}</h2><p>{theme.description}</p></div><div className="theme-cover">{coverId?<ThemeImage key={theme.id} photoId={coverId} cover compact/>:<div className="theme-cover-empty"><span>대표 사진 없음</span></div>}</div><p className="theme-cover-credit">{coverId&&photoById[coverId]?<>대표 사진 © <a href={photoById[coverId].source} target="_blank" rel="noreferrer">{photoById[coverId].author||'Wikimedia Commons'}</a> · <a href={photoById[coverId].licenseUrl} target="_blank" rel="noreferrer">{photoById[coverId].license}</a>{photoById[coverId].reference&&<> · {photoById[coverId].reference!.label}</>}</>:'\u00a0'}</p></div>}
  <div className="theme-toolbar">
   <div className="theme-toolbar-actions">{!filtering&&<>
    {theme.caution&&<button className={panel==='caution'?'is-open':''} aria-expanded={panel==='caution'} aria-controls="theme-panel-caution" onClick={()=>setPanel(panel==='caution'?null:'caution')}><TriangleAlert size={15} aria-hidden="true"/>방문 전 확인<ChevronDown size={14} aria-hidden="true"/></button>}
    {themeRefs.length>0&&<button className={panel==='refs'?'is-open':''} aria-expanded={panel==='refs'} aria-controls="theme-panel-refs" onClick={()=>setPanel(panel==='refs'?null:'refs')}><BookOpen size={15} aria-hidden="true"/>출처 {themeRefs.length}개<ChevronDown size={14} aria-hidden="true"/></button>}
    {ratingSearch[theme.id]&&<a href={'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:ratingSearch[theme.id].query})} target="_blank" rel="noreferrer"><Star size={15} aria-hidden="true"/>{ratingSearch[theme.id].label} 평점 비교<ArrowUpRight size={14} aria-hidden="true"/></a>}
   </>}</div>
   <label className="theme-sort">정렬<select aria-label="장소 정렬" value={sort} onChange={event=>setSort(event.target.value as ThemeSort)}><option value="name">이름순</option><option value="photo">사진 있는 순</option></select></label>
  </div>
  {!filtering&&theme.caution&&<div id="theme-panel-caution" className="theme-panel theme-caution" hidden={panel!=='caution'}><p>{theme.caution}</p></div>}
  {!filtering&&themeRefs.length>0&&<div id="theme-panel-refs" className="theme-panel theme-references" hidden={panel!=='refs'}>{themeRefs.map(item=><div key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<ArrowUpRight size={14}/></a>{item.note&&<p>{item.note}</p>}</div>)}</div>}
  {visible.length>0&&<div className="theme-spots">{visible.map(renderSpot)}</div>}
  {!visible.length&&<div className="theme-empty"><h3>{savedOnly?'저장한 항목이 없습니다':'검색 결과가 없습니다'}</h3><p>{savedOnly?'관심 항목의 저장 버튼을 눌러 모아보세요.':'다른 장소명이나 지역으로 검색해보세요.'}</p><button className="secondary-button" onClick={()=>{setQuery('');setSavedOnly(false)}}>테마로 돌아가기</button></div>}
  <dl className="theme-footnote">
   <div><dt>저장</dt><dd>저장한 후보는 이 기기에만 보관하며 여행 일정에 자동으로 추가하지 않습니다.{message&&<span role="status"> {message}</span>}</dd></div>
   <div><dt>자료</dt><dd>{status==='remote'?'서버에서 받은 최신 여행 자료입니다.':status==='fallback'?'서버 자료를 받지 못해 앱에 포함된 기본 자료를 보여줍니다.':'여행 자료를 확인하는 중입니다.'} 영업·행사 정보는 카드의 공식 출처와 확인 날짜를 기준으로 합니다.</dd></div>
   <div className="theme-footnote-code"><dt>코드</dt><dd><a href="https://github.com/researcherhojin/tokyo-winter-trip" target="_blank" rel="noreferrer">GitHub 저장소<ArrowUpRight size={13} aria-hidden="true"/></a> · 만든 과정과 요청 기록 포함</dd></div>
  </dl>
  </div></div></div>
 </section>
}

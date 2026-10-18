import { Check, ChevronRight, ExternalLink } from 'lucide-react'
import type { CatalogData } from '../shared/catalogContract'
import { bookingPage } from '../data/travelSupport'
import { starWarsEntryNotice } from '../data/references'

type PreparationData=CatalogData<'preparation'>
type Link={title:string;url:string}
type Guide={steps:string[];links:Link[]}
const prompts:Record<string,string>={
 flight:'여권 영문명·유효기간과 항공권 이름·날짜 대조',
 stay:'11/11 확정 예정 기록 · 주소와 짐 보관 답변 확인',
 cancel:'새 숙소 확정 확인 → 이전 예약 취소 기한·환불 확인',
 harry:'12/13 10:00 계획 · 결제 내역과 3인 QR 확인',
 poke:'12/12 Trainer’s Pass · 포레스트 11:00–12:00 입장',
 sky:'12/14 방문 · 입장권과 당일 기상 확인',
 dinner:'12/13 저녁 · 만날 장소와 시간 정하기',
 transport:'귀국일 나리타 T2 15:30–16:00 도착 목표',
 park:'방문일 운영 캘린더와 곤돌라 마감 확인',
 starwars:'일반 입장 예약제 종료 · 방문일 행사 조건 확인',
 shopping:'갈 매장의 휴업·정리권·구매 제한 확인',
 'suica-device':'아이폰은 지갑 앱 · 그 외 기기는 나리타에서 Welcome Suica 카드',
 'suica-charge':'결제 카드 또는 현지 현금 충전 방법 준비',
 'suica-express':'익스프레스 설정 · 같은 기기의 같은 카드로 출입',
 yoyogi:'신주쿠 경유 시 검토 · 정확한 촬영 위치 미확인',
 taxfree:'11/1부터 매장 과세 결제 → 출국 때 환급',
 safety:'Safety tips 앱 설치 · 한국어 핫라인 050-3816-2787',
 ready:'여권·eSIM·예약 QR·방한용품 챙기기',
}
export function preparationPrompt(id:string,note:string){return prompts[id]??note}
export function preparationGuide(id:string,data:PreparationData):Guide {
 const booking={title:'공유 예약 기록에서 근거 확인',url:bookingPage}
 const guides:Record<string,Guide>={
  flight:{steps:['여권 영문명·유효기간을 확인하고 항공사 예약 조회의 3인 이름·날짜·공항·터미널과 대조하세요.','체크인·수하물·탑승 마감과 예약번호를 따로 저장하세요. 공유 시각만으로 발권 완료를 판단하지 마세요.'],links:[booking]},
  stay:{steps:['숙소 예약 확인서의 최종 확정 상태·주소·체크인 방법을 확인하세요.','12/11 체크인 전과 12/15 체크아웃 후 짐 보관 가능 시간·요금을 숙소에 확인하고 답변을 저장하세요.'],links:[booking]},
  cancel:{steps:['신바시 숙소의 최종 예약 확정을 먼저 확인하세요. 그다음 이전 숙소 예약 확인서에서 무료 취소 기한·시간대를 확인하세요.','실제 취소는 예약한 서비스에서 직접 진행하고 취소 확인서·환불 내역을 보관하세요. 이 체크는 취소 요청을 보내지 않습니다.'],links:[booking]},
  harry:{steps:['12/13 10:00는 계획 기준입니다. 실제 티켓의 날짜·시간·3인 권종을 대조하세요.','예매 완료 메일·결제 내역·QR을 모두 확인하고 오프라인으로 저장하세요. 체크 자체는 예약 확정을 의미하지 않습니다.'],links:[{title:'스튜디오 공식 방문 안내',url:'https://www.wbstudiotour.jp/'},booking]},
  poke:{steps:['확인된 Trainer’s Pass 3장의 12/12 날짜와 포레스트 11:00–12:00 입장 창을 다시 대조하세요.','QR을 각자 기기에 저장하고 이용 구역·접근편·해당일 운영을 확인하세요. 입장 창을 관람 종료 시각으로 해석하지 마세요.'],links:[{title:'포케파크 공식 안내',url:'https://www.pokepark-kanto.co.jp/'},booking]},
  sky:{steps:['12/14 전망대 방문 시간과 실제 입장권·결제 여부를 대조하세요.','당일 운영·기상·입장 대기와 취소 조건을 확인하세요. 소라마치 매장 이용과 전망대 티켓은 별개입니다.'],links:[{title:'스카이트리 공식 안내',url:'https://www.tokyo-skytree.jp/'}]},
  dinner:{steps:['12/13 저녁의 장소·시간·인원과 만날 역 출구를 정하세요.','식당을 예약했다면 확인서와 취소 조건을 저장하고 오후 쇼핑 종료 시각을 역산하세요.'],links:[booking]},
  transport:{steps:['12/15 나리타 T2 15:30–16:00 도착 목표로 열차 출발·환승·짐 회수 시간을 역산하세요.','예약 열차와 일반 교통카드 이용 구간을 구분하고 당일 운행·항공사 수속 마감을 확인하세요. 계획 소요시간은 실시간 운행 정보가 아닙니다.'],links:[{title:'나리타공항 공식 교통 안내',url:'https://www.narita-airport.jp/ja/access/'}]},
  park:{steps:['12/12 공식 운영 캘린더와 포케파크 티켓 입장 시간을 먼저 확인하세요.','일루미네이션·곤돌라 마감과 대체 접근편을 확인하고 일반 놀이기구 별도 요금을 구분하세요.'],links:[{title:'요미우리랜드 공식 안내',url:'https://www.yomiuriland.com/'},{title:'포케파크 공식 안내',url:'https://www.pokepark-kanto.co.jp/'}]},
  starwars:{steps:['일반 입점 예약제는 10/13 공식 공지로 종료되었습니다.','12/13 최신 공지의 혼잡 정리권·별도 행사·커스텀 상품 접수 조건을 확인하세요.'],links:[{title:'공식 입점 예약제 종료 공지',url:starWarsEntryNotice}]},
  shopping:{steps:['방문할 점포별 영업·휴무와 행사 입점 공지를 확인하세요.','상품 재고·구매 수량·별도 체험 접수를 일반 입장 가능 여부와 구분하세요.'],links:[{title:'포켓몬센터 공식 점포 안내',url:'https://shop.pokemon.co.jp/'},{title:'스타워즈 공식 점포',url:'https://benelicstore.com/info/shop/'}]},
  yoyogi:{steps:['공유된 위치는 촬영 후보이며 정확한 건널목·열차 동시 통과 시각은 미검증입니다.','신주쿠 경유일 시간 여유가 있을 때 지도에서 보행 접근을 확인하세요.'],links:[{title:'공유 위치 주변 검색',url:data.yoyogiSpot.url}]},
  taxfree:{steps:['2026-11-01 구매분부터 매장에서는 세금을 포함해 결제하고, 출국 때 공항 면세 단말기에 여권을 대 반출이 확인되면 매장이나 위탁 환급업체가 환급합니다.','같은 매장 하루 세금 제외 5,000엔 이상·구매 후 90일 이내·직접 들고 나가는 수량만 해당합니다. 단말기에서 검사가 나오면 물건을 보여줘야 하므로 면세품을 부치기 전에 공항 안내를 확인하세요.'],links:[{title:'관광청 · 새 면세 제도 안내',url:'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00021.html'},{title:'관광청 · 한국어 리플릿(PDF)',url:'https://www.mlit.go.jp/kankocho/tax-free/content/001991776.pdf'}]},
  safety:{steps:['관광청 공식 무료 앱 Safety tips를 설치하고 언어를 한국어로 설정하세요. 진도 5약 이상 긴급지진속보·쓰나미 경보·기상 특별경보를 푸시로 받습니다.','사고·질병·재해 때 쓰는 JNTO 방문객 핫라인 050-3816-2787(해외 +81-50-3816-2787, 24시간 한국어)을 연락처에 저장하세요.'],links:[{title:'JNTO · Safety tips 앱',url:'https://www.jnto.go.jp/safety-tips/eng/app.html'},{title:'JNTO · 방문객 핫라인',url:'https://www.japan.travel/en/plan/hotline/'}]},
  ready:{steps:['여권·예약 확인서·QR·통신 개통 방법을 오프라인으로 저장하세요.','보조 배터리·액체류·식품 등 반입 조건은 실제 항공사와 공항 안내에서 확인하고 방한용품을 챙기세요.'],links:[{title:'나리타공항 공식 안내',url:'https://www.narita-airport.jp/ja/'}]},
 }
 if(id.startsWith('suica-'))return {steps:data.suicaGuide.filter((_,i)=>id==='suica-device'?i===0||i===3:id==='suica-charge'?i===1:i===2).map(x=>x.body),links:data.preparationSources}
 return guides[id]??{steps:['안내를 읽고 실제 확인서·예약 서비스의 상태를 확인한 뒤 체크하세요.'],links:[]}
}
export function PreparationPriorities({checked,onSelect}:{checked:Record<string,boolean>;onSelect:(id:string)=>void}) {
 const items=[{id:'harry',title:'해리포터 10:00 입장',note:'계획 기준 · 예매·결제·3인 QR 확인'}, {id:'stay',title:'숙소 확정·짐 보관',note:'최종 확인서와 도착·귀국일 보관 답변'}, {id:'cancel',title:'이전 숙소 취소 기한',note:'새 숙소 확정 후 · 11월 기한·환불 조건 확인'}]
 return <section className="prep-priorities" aria-labelledby="prep-priority-title"><h2 id="prep-priority-title" className="prep-aside-label">우선 확인 3가지</h2><div className="prep-priority-list">{items.map(item=><button key={item.id} className={checked[item.id]?'is-done':''} onClick={()=>onSelect(item.id)}><span className="prep-status-dot" aria-hidden="true">{checked[item.id]&&<Check size={12}/>}</span><span><strong>{item.title}</strong><small>{item.note}</small>{checked[item.id]&&<em>개인 확인 완료</em>}</span><ChevronRight size={16} aria-hidden="true"/></button>)}</div></section>
}
export function PreparationActionGuide({id,note,data}:{id:string;note:string;data:PreparationData}) {
 const guide=preparationGuide(id,data)
 return <details className="prep-action-guide"><summary aria-label="확인 방법·근거 보기">상세<span aria-hidden="true">+</span></summary><div className="prep-action-content"><p>{note}</p><ol>{guide.steps.map(step=><li key={step}>{step}</li>)}</ol>{guide.links.length>0&&<nav aria-label="확인할 참고 자료">{guide.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.title}<ExternalLink size={14} aria-hidden="true"/></a>)}</nav>}</div></details>
}

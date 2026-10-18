import placesData from './places.json'
import { starWarsEntryNotice } from './references'
import { itineraryDetails } from './itineraryDetails'
import type { StopGuide } from './itineraryDetails'
export interface PlaceGuide {
 overview: string
 visitPlan: string[]
 access: string
 tips: string[]
 budget: string
 sources: { title: string; url: string }[]
 checkedAt: string
}
export type Place = Omit<(typeof placesData)[number], 'guide'> & { guide: PlaceGuide }
export const places: Place[] = placesData
export const placeById = Object.fromEntries(places.map(p => [p.id, p])) as Record<string, Place>
export type Booking = '미확인' | '합의됨 · 결제 미확인' | '해당 없음' | '공유 항공편' | '결제 기록 · 상세 미확인' | '티켓 원문 확인'
export interface Stop { time: string; end?: string; title: string; place?: string; duration: string; note: string; optional?: boolean; booking?: Booking; from?: string; transit?: string; travelTime?: string; mode?: 'transit' | 'walking'; guide?:StopGuide; photoId?:string }
export interface Resource { title: string; url: string; summary: string }
export interface Day { id: number; date: string; weekday: string; title: string; subtitle: string; color: string; warning: string; stops: Stop[]; resources: Resource[] }
const initialDays: Day[] = [
 {id:1,date:'2026-12-11',weekday:'금',title:'오다이바·도쿄타워',subtitle:'오다이바의 노을, 도쿄타워의 밤',color:'#234f9b',warning:'입국이 늦어지면 오다이바 체류를 줄이세요. 숙소는 신바시5丁目29 구역입니다. 사전 짐 보관과 건물 입구는 예약 안내로 확인하세요.',stops:[
 {time:'08:35',end:'10:55',title:'인천 T1 출발 → 나리타 T2 도착',place:'narita',duration:'항공편 시각',booking:'공유 항공편',note:'공유된 항공편 기준. 일행 전체 항공권과 항공사·편명은 별도 확인. 10:55–12:15 입국심사·수하물·교통카드 준비.'},
 {time:'13:50',end:'14:30',title:'신바시 도착 · 짐 맡기기',place:'shinbashi',duration:'40분 계획',booking:'미확인',note:'12:15 공항 출발 계획. 숙소(신바시5丁目29 구역, 역에서 도보 약 7분) 사전 짐 보관 미확정 · 신바시역 코인로커 대안.',from:'narita',transit:'게이세이 Access Express → 도에이 아사쿠사선 신바시 직통편 확인. 대안: Skyliner → 닛포리 → JR 야마노테선 → 신바시.',travelTime:'95분 계획'},
 {time:'15:15',end:'16:50',title:'오다이바 해변공원',place:'odaiba',duration:'1시간 35분 계획',booking:'해당 없음',note:'자유의 여신상과 레인보우브리지, 해변에서 간식과 사진. 일몰 16:28(국립천문대 기준) · 실제 노을과 바람은 당일 확인.',from:'shinbashi',transit:'14:30 출발 · 유리카모메 신바시 → 오다이바카이힌코엔 또는 다이바 → 도보.',travelTime:'45분 계획'},
 {time:'17:40',end:'19:20',title:'조조지·시바공원 · 도쿄타워 야경',place:'tower',duration:'1시간 40분 계획',booking:'해당 없음',note:'조조지 산문 앞 야경 필수. 전망대는 선택·유료이며 예약 여부 미확인(메인덱 09:00–23:00, 최종 입장 22:30). 도쿄타워 랜드마크 라이트는 일몰~24:00, 다이아몬드 베일 정기 점등은 월·목뿐이라 12/11(금)에는 없습니다. 근처 시바공원(오나리몬역 앞)에서 도쿄 크리스마스 마켓이 열립니다: 11:00–22:00, 최종 입장 21:00, 12/11은 성인 1,000엔.',from:'odaiba',transit:'16:50 출발 · 유리카모메 → 신바시 → 도에이 아사쿠사선 다이몬 → 도보(공식 안내 도쿄타워까지 약 10분, 조조지를 거치면 여유 있게).',travelTime:'50분 계획'},
 {time:'19:20',end:'21:00',title:'신바시 저녁 · 숙소 체크인',place:'shinbashi',duration:'이동·식사 포함',note:'식당과 체크인 세부 시간 미정. 늦어지면 저녁 일정을 유연하게 조정.',from:'tower',transit:'다이몬 → 아사쿠사선 신바시 또는 도보·JR 조합.',travelTime:'당일 조회'}
 ],resources:[{title:'오다이바 산책 가이드',url:'https://www.gotokyo.org/kr/story/walks-and-tours/odaiba/index.html',summary:'해변과 레인보우브리지 주변 도보 코스를 확인하세요. 사진 위치와 바람을 고려해 동선을 줄일 수 있습니다.'},{title:'도쿄타워 공식 안내',url:'https://en.tokyotower.co.jp/',summary:'전망대는 별도 유료 선택 일정입니다. 층별 운영시간과 당일 조명 안내를 확인하세요.'}]},
 {id:2,date:'2026-12-12',weekday:'토',title:'포케파크·요미우리랜드',subtitle:'PokéPark KANTO & 요미우리랜드',color:'#43806c',warning:'티켓 3장 원문 확인: Trainer’s Pass, 포레스트 11:00–12:00 입장. 아래 관람·이동시간은 여유를 둔 계획이며, 입장 가능 구간을 관람 종료시간으로 해석하지 않습니다.',stops:[
 {time:'08:00',title:'신바시 출발',place:'shinbashi',duration:'오전 이동 계획',note:'포레스트 입장시간에 맞춰 기존 09:00 출발 계획을 앞당김. 티켓 QR·공식 앱·방한용품 준비.'},
 {time:'09:45',end:'10:30',title:'요미우리랜드 도착 · 입장 준비',place:'yomiuri',duration:'45분 여유 계획',booking:'티켓 원문 확인',note:'티켓 3장 모두 12/12 Trainer’s Pass. 공식 캘린더상 12/12(토) 요미우리랜드는 10:00–21:00, 포케파크는 11:00–19:00 영업입니다. 09:45에 도착하면 개원까지 기다립니다. 곤돌라 운행은 당일 공식 운행 상황으로 확인.',from:'shinbashi',transit:'JR 야마노테선 → 신주쿠 → 게이오선 하시모토·다마센터행 구간급행/쾌속 직통(급행·특급은 조후에서 환승) → 게이오요미우리랜드 → 스카이셔틀 곤돌라. 곤돌라 미운행 시 공식 버스 접근 확인.',travelTime:'1시간 45분 계획'},
 {time:'10:30',end:'11:00',title:'포레스트 입구 이동 · 티켓 준비',place:'yomiuri',duration:'30분 여유 계획',booking:'티켓 원문 확인',note:'11:00 입장을 목표로 입구·화장실·QR 준비. 운영사 안내와 현장 대기 우선.'},
 {time:'11:00',end:'13:00',title:'포켓몬 포레스트 체험',place:'yomiuri',duration:'2시간 관람 계획 · 입장 가능 11:00–12:00',booking:'티켓 원문 확인',note:'티켓 지정 입장 구간은 11:00–12:00입니다. 이 표의 13:00은 이후 식사·타운 이동을 위한 계획값이며 티켓상 관람 종료시간이 아닙니다.'},
 {time:'13:00',end:'16:30',title:'카야츠리 타운 · 점심 · 굿즈',place:'yomiuri',duration:'3시간 30분 계획',booking:'티켓 원문 확인',note:'Sedge Town(카야츠리 타운)은 운영시간 내 입장 가능. 점심·휴식·굿즈와 공연 정리권은 당일 안내에 맞춰 조정.'},
 {time:'16:30',end:'18:30',title:'공연 · 일루미네이션 · 기념품',photoId:'stop-yomiuri-jewellumination',place:'yomiuri',duration:'2시간 계획',booking:'해당 없음',note:'주얼루미네이션(2026/10/29~2027/4/4)은 16:00부터 점등(시기별 변동). 12/12 요미우리랜드는 21:00, 포케파크는 19:00까지 영업합니다. 포케파크 이벤트 「피카피카 스파크!」 12:45·14:00·16:30·17:45(기상 등으로 변경·중지 가능). 일반 놀이기구와 곤돌라 스카이셔틀(편도 300엔)은 별도 요금. 피로하면 저녁 관람 단축.',optional:true},
 {time:'18:30',end:'21:00',title:'신주쿠 저녁 · 신바시 복귀',photoId:'stop-shinjuku-night',place:'shinbashi',duration:'이동·식사 포함',note:'19:45 신주쿠 도착 계획 후 저녁. 귀가시간과 체력에 따라 식사 장소 조정.',from:'yomiuri',transit:'곤돌라 → 게이오요미우리랜드 → 조후 → 게이오 신주쿠 → JR 야마노테선 신바시.',travelTime:'신주쿠까지 75분 계획'}
 ],resources:[{title:'포케파크 티켓 비교',url:'https://www.pokepark-kanto.co.jp/ppark/ticketInfo/type/index',summary:'Trainer’s Pass는 지정시간 내 포레스트 1회 입장. Town Pass는 타운만 이용합니다. 해외 거주자는 공식 영문 판매처를 확인하세요.'},{title:'포케파크 공식 소개 영상',url:'https://www.youtube.com/watch?v=VB_rAglcZ34',summary:'Notion에 등록된 소개 영상입니다. 영상 내용·게시자 재검증 필요. 여행일 운영과 티켓 조건은 공식 페이지 우선.'},{title:'요미우리랜드 일루미네이션',url:'https://www.yomiuriland.com/jewellumination/index.html',summary:'공식 행사 안내·영상에서 점등과 분수쇼를 확인하세요. 12/12 시간과 곤돌라 운행은 별도 확인 필요.'}]},
 {id:3,date:'2026-12-13',weekday:'일',title:'해리포터·이케부쿠로',subtitle:'해리포터 스튜디오 & 이케부쿠로',color:'#786098',warning:'해리포터 10:00 입장 기준으로 계획합니다. 예매·결제 완료가 확인되지 않았습니다. 저녁 약속 장소도 미정입니다.',stops:[
 {time:'08:00',title:'신바시 출발',place:'shinbashi',duration:'이동 준비',note:'09:00 스튜디오 도착 목표.'},
 {time:'09:00',end:'10:00',title:'스튜디오 도착 · 입장 준비',place:'harry',duration:'1시간 계획',note:'예약 전 로비 입장 가능 시간과 첫 타임 예외는 공식 규정 재확인.',from:'shinbashi',transit:'숙소 → 다이몬 또는 시오도메역 도보 → 오에도선 롯폰기·도초마에 방면 → 도초마에에서 히카리가오카행 환승 → 토시마엔 → 도보 약 2분.',travelTime:'1시간 계획'},
 {time:'10:00',end:'14:30',title:'해리포터 스튜디오 투어',photoId:'stop-harry-platform',place:'harry',duration:'4시간 30분 계획',booking:'합의됨 · 결제 미확인',note:'호그와트 대연회장, 9¾ 승강장, 버터비어와 기념사진. 식사 포함 여유 있게 관람.'},
 {time:'15:20',end:'16:40',title:'스타워즈 스토어 by BENELIC',place:'starwars',duration:'1시간 20분 계획',booking:'해당 없음',note:'이케부쿠로 PARCO 본관 6층. 한정 굿즈와 일부 상품을 원하는 디자인으로 꾸미는 체험형 굿즈 코너(유료). 10/13 공식 공지로 일반 입장 예약제 종료 확인. 혼잡 시 정리권·입장 제한, 12/13 재공지와 별도 체험 조건 확인.',from:'harry',transit:'14:30 출발 · 세이부 토시마엔 → 네리마 → 세이부 이케부쿠로선 이케부쿠로. 편에 따라 직통 가능.',travelTime:'50분 계획'},
 {time:'16:40',end:'17:50',title:'Pokémon Center MEGA TOKYO',place:'mega',duration:'도보 포함 1시간 10분',optional:true,note:'Sunshine City alpa 2F. 저녁 약속에 늦어지면 생략.',from:'starwars',transit:'PARCO → Sunshine City alpa 도보 약 15~20분.',travelTime:'15~20분 계획',mode:'walking'},
 {time:'17:50',end:'19:00',title:'저녁 약속 장소로 이동',duration:'1시간 10분 확보',note:'신주쿠·시부야·에비스 중 협의. 장소 확정 후 Google Maps에서 출발지·도착지 조회.'},
 {time:'19:00',end:'21:00',title:'저녁 약속 검토',duration:'2시간 계획',booking:'미확인',note:'12/13 저녁 가능 연락만 확인. 시간·장소·식당 예약 모두 미확정.'},
 {time:'21:00',title:'신바시 숙소 복귀',place:'shinbashi',duration:'당일 조회',note:'저녁 장소 확정 후 JR 야마노테선 등 귀환 경로 조회.'}
 ],resources:[{title:'스튜디오 공식 방문 안내·접근 영상',url:'https://www.wbstudiotour.jp/plan-your-visit/location/',summary:'토시마엔역에서 도보 약 2분. 공식 접근 안내와 영상으로 입구를 확인하세요.'},{title:'스타워즈 입장 예약제 종료 안내',url:starWarsEntryNotice,summary:'2026/10/13 공식 공지: 일반 입장 예약제 종료. 혼잡 시 정리권·입장 제한 가능. 12/13 재공지와 별도 체험 조건은 방문 전 확인하세요.'},{title:'MEGA TOKYO 매장 정보',url:'https://shop.pokemon.co.jp/en/shop/pokemoncenter-megatokyo/',summary:'Sunshine City alpa 2층. 일반 안내 10:00–20:00. 휴업·입장 제한은 방문 전에 확인하세요.'}]},
 {id:4,date:'2026-12-14',weekday:'월',title:'아사쿠사·스카이트리',subtitle:'아사쿠사 · 스카이트리 · 아키하바라',color:'#ad7740',warning:'스카이트리 일몰·예약시간과 아키하바라 점포별 마감을 확인하세요. 입장권 구매 완료 여부는 미확인입니다.',stops:[
 {time:'09:15',title:'신바시 출발',place:'shinbashi',duration:'이동 준비',note:'아사쿠사로 이동.'},
 {time:'10:00',end:'11:30',title:'카미나리몬 · 나카미세 · 센소지',place:'sensoji',duration:'1시간 30분 계획',note:'참배와 나카미세 간식. 11:30–12:30 아사쿠사 점심.',from:'shinbashi',transit:'도에이 아사쿠사선 신바시 → 아사쿠사 직통편 → 도보.',travelTime:'45분 계획'},
 {time:'13:15',end:'15:10',title:'소라마치 · Pokémon Center SKYTREE TOWN',place:'skypokemon',duration:'1시간 55분 계획',note:'이스트야드 4F에서 한정 굿즈 확인.',from:'sensoji',transit:'12:30 출발 · 도부 아사쿠사역 → 도쿄스카이트리역 1정거장 → 도보. 날씨가 좋으면 강변 산책 검토.',travelTime:'45분 계획(도보·강변 산책 포함)'},
 {time:'15:10',end:'17:00',title:'스카이트리 전망대 · 일몰과 야경',place:'skytree',duration:'1시간 50분 계획',booking:'미확인',note:'12/14 도쿄 일몰 16:29(국립천문대). 일몰 전 입장 목표, 예약 입장시간·기상 확인. 이날은 크리스마스 특별 라이팅 점등일(17:30–22:00)이라 전망대를 나온 뒤 타워 아래에서 볼 수 있습니다. 4층 스카이 아레나 크리스마스 마켓 11:00–22:00.',from:'skypokemon',transit:'소라마치에서 전망대 입장층으로 도보 이동.',travelTime:'현장 동선 확인',mode:'walking'},
 {time:'17:50',end:'20:15',title:'아키하바라 쇼핑',place:'akihabara',duration:'2시간 25분 계획',note:'라디오회관 → 애니메이트 순서. 매장 폐점시간 확인.',from:'skytree',transit:'17:00 출발 · 오시아게 아사쿠사선 → 아사쿠사바시 → JR 소부선 아키하바라.',travelTime:'50분 계획'},
 {time:'20:15',end:'21:30',title:'저녁 · 신바시 귀환',place:'shinbashi',duration:'이동·식사 포함',note:'쇼핑 종료 후 저녁과 숙소 복귀.',from:'akihabara',transit:'JR 야마노테선 아키하바라 → 신바시.',travelTime:'당일 조회'}
 ],resources:[{title:'아사쿠사 공식 산책 가이드',url:'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/',summary:'카미나리몬에서 나카미세·센소지로 이어지는 도보 코스. 강변 산책은 날씨와 대기시간에 따라 조정하세요.'},{title:'스카이트리 공식 안내',url:'https://www.tokyo-skytree.jp/',summary:'전망대·운영 캘린더·티켓을 확인하세요. 홈페이지의 오늘 일몰시각을 12/14 시각으로 사용하면 안 됩니다.'},{title:'SKYTREE TOWN 공식 매장',url:'https://shop.pokemon.co.jp/en/shop/pokemoncenter-skytreetown/',summary:'Solamachi East Yard 4층. 일반 안내 10:00–21:00이며 변경될 수 있습니다.'},{title:'아키하바라 도보 가이드',url:'https://www.gotokyo.org/en/story/walks-and-tours/akihabara/',summary:'쇼핑 지역과 도보 코스를 확인하세요. 라디오회관·애니메이트는 개별 영업시간 확인 필요.'}]},
 {id:5,date:'2026-12-15',weekday:'화',title:'츠키지·긴자·귀국',subtitle:'츠키지 · 긴자 · 귀국',color:'#547e92',warning:'15:30–16:00 나리타 T2 도착 목표. 항공사 체크인·수하물·탑승 마감시간을 반드시 확인하고 쇼핑보다 귀국 이동을 우선하세요.',stops:[
 {time:'08:00',end:'09:00',title:'체크아웃 · 짐 보관',place:'shinbashi',duration:'1시간 계획',booking:'미확인',note:'숙소 수하물 보관 미확정. 신바시역 로커 대안.'},
 {time:'09:30',end:'10:45',title:'츠키지 장외시장 · 조식',place:'tsukiji',duration:'1시간 15분 계획',note:'해산물 덮밥과 계란말이. 츠키지 공식 캘린더상 12/15(화)는 영업일입니다(일반 판매 09:00–14:00 중심). 점포별 휴무·대기는 따로 확인.',from:'shinbashi',transit:'09:00 출발 · 오에도선 시오도메 → 쓰키지시조(1정거장) → 도보 약 1분. 대안: 아사쿠사선 신바시 → 히가시긴자 → 도보 약 3분.',travelTime:'30분 계획'},
 {time:'11:15',end:'12:30',title:'긴자 쇼핑 · 카페',place:'ginza',duration:'1시간 15분 계획',note:'매장 1~2곳만 방문. 면세와 결제 대기에 여유 확보. 긴자 토리코로루 본점은 화요일 정기휴무라 12/15에는 다른 카페를 고릅니다.',from:'tsukiji',transit:'10:45 출발 · 도보 약 15~20분 또는 지하철.',travelTime:'30분 확보',mode:'walking'},
 {time:'12:30',end:'13:15',title:'신바시 복귀 · 짐 회수',place:'shinbashi',duration:'45분 확보',note:'13:15 공항 이동 시작 계획. 짐 회수 후 신바시·다이몬역 중 가까운 역 이용. 열차 시간은 아직 확정되지 않음.',from:'ginza',transit:'긴자선 긴자 → 신바시 또는 도보.',travelTime:'긴자→신바시 약 10분 · 숙소까지 도보 약 7분'},
 {time:'15:30',end:'18:15',title:'나리타 T2 · 출국 수속',place:'narita',duration:'2시간 45분 확보',note:'18:55 출발보다 3시간 25분 앞선 도착 목표. 항공사 체크인 마감 기준 우선.',from:'shinbashi',transit:'13:15 출발 · 아사쿠사선 나리타공항행 Access Express 직통 확인(직통 편수가 적고, 편성에 따라 짐 공간이 다름). 대안: JR → 닛포리 → Skyliner(좌석·짐칸) → 공항 제2빌딩역(Terminal 2·3). 큰 짐 3개로 혼잡하면 Skyliner 우선 검토.',travelTime:'2시간 15분 확보'},
 {time:'18:55',end:'21:50',title:'나리타 T2 출발 → 인천 T1 도착',place:'narita',duration:'항공편 시각',booking:'공유 항공편',note:'국제선 탑승 마감시간·출발 게이트를 현장에서 재확인.'}
 ],resources:[{title:'츠키지 공식 방문 가이드·영상',url:'https://www.tsukiji.or.jp/english/how-to-enjoy/',summary:'시장 이용 예절과 첫 방문 가이드를 확인하세요. 점포별 영업과 공식 휴무 캘린더를 함께 확인해야 합니다.'},{title:'긴자 공식 도보 코스',url:'https://www.gotokyo.org/en/story/walks-and-tours/ginza/',summary:'관심 매장을 미리 골라 이동을 줄이세요. 귀국일에는 면세·짐 회수 시간을 포함해 계획합니다.'},{title:'나리타 공항 교통 안내',url:'https://www.narita-airport.jp/en/access/',summary:'제2터미널 도착 기준으로 열차를 조회하세요. 이 앱의 시간은 계획값이며 운행·지연 정보가 아닙니다.'}]}
]
export const days:Day[]=initialDays.map(day=>({...day,stops:day.stops.map(stop=>({...stop,guide:itineraryDetails[`${day.id}/${stop.time}`]}))}))
export const checklist = [
 {id:'flight',group:'먼저 확정할 예약',title:'여권·3인 항공권·터미널 확인',note:'여권 영문명·유효기간과 항공권 이름·날짜·터미널을 대조하고 항공사 수속 마감을 확인.'},
 {id:'harry',group:'먼저 확정할 예약',title:'12/13 해리포터 10:00 3인 예매·결제 확인',note:'10:00 입장 기준으로 계획. 예매·결제 완료와 QR은 별도 확인.'},
 {id:'stay',group:'먼저 확정할 예약',title:'신바시 숙소 예약·정확한 주소 확인',note:'Notion에 결제 기록과 11/11 확정 예정 표기가 함께 있음. 실제 예약 상태·짐 보관 재확인.'},
 {id:'cancel',group:'먼저 확정할 예약',title:'새 숙소 확정 후 이전 숙소 취소·환불 확인',note:'새 숙소의 최종 확정을 먼저 확인한 뒤 이전 숙소의 11월 취소 기한·환불 조건을 확인. 앱에서는 예약을 취소하지 않습니다.'},
 {id:'sky',group:'먼저 확정할 예약',title:'스카이트리 전망대 예약·일몰 확인',note:'12/14 운영시간·입장권·기상 재확인.'},
 {id:'dinner',group:'먼저 확정할 예약',title:'12/13 저녁 장소·시간 확정',note:'신주쿠·시부야·에비스 중 협의. 식당 예약 미확정.'},
 {id:'poke',group:'교통·입장 준비',title:'포케파크 티켓 권종·지정시간·QR 확인',note:'티켓 3장 원문 확인: 12/12 Trainer’s Pass, 포레스트 11:00–12:00 입장. QR은 개인 기기에 보관, 운영시간·놀이기구 요금 별도 확인.'},
 {id:'transport',group:'교통·입장 준비',title:'공항 왕복 열차·직통 운행·예약 검토',note:'Access Express 직통 여부와 Skyliner 대안. 귀국일 15:30–16:00 T2 도착 목표.'},
 {id:'suica-device',group:'교통·입장 준비',title:'Suica 지원 기기·카드 준비',note:'아이폰은 Apple 지갑의 지원 조건 확인. 해외판 갤럭시의 Welcome Suica Mobile은 2027년 상반기 예정이라 이번 여행에는 나리타에서 Welcome Suica 실물 카드(보증금 없음·28일 사용·잔액 환불 불가)를 준비.'},
 {id:'suica-charge',group:'교통·입장 준비',title:'Suica 등록·충전·잔액 확인',note:'아이폰 지갑 → ＋ → 교통카드 → Suica. 지원 카드로 충전하거나 현지의 모바일 대응 충전기·편의점에서 현금 충전.'},
 {id:'suica-express',group:'교통·입장 준비',title:'익스프레스 교통 카드·사용 주의사항 확인',note:'설정 → 지갑 및 Apple Pay → 익스프레스 교통 카드 확인. 입장·퇴장은 같은 기기의 같은 카드 사용. 아래 Suica 준비 가이드 참고.'},
 {id:'park',group:'출발 전 최종 확인',title:'12월 운영·일루미네이션·곤돌라 확인',note:'포케파크 운영 캘린더와 요미우리랜드 막차·휴무 확인.'},
 {id:'starwars',group:'출발 전 최종 확인',title:'스타워즈 입장·체험 조건 재확인',note:'10/13 공식 안내로 일반 입장 예약제 종료 확인. 혼잡 시 정리권과 12/13 재공지·별도 이벤트 조건 확인.'},
 {id:'shopping',group:'출발 전 최종 확인',title:'매장 영업·이벤트 입장 조건 확인',note:'스타워즈의 방문일 입장·이벤트 조건과 포켓몬센터 휴업 공지 확인.'},
 {id:'taxfree',group:'출발 전 최종 확인',title:'면세가 출국 시 환급 방식으로 바뀐 것 확인',note:'면세 방식이 바뀌어 면세품은 출국 공항에서 환급 절차를 거칩니다. 공항 시간에 여유를 두세요.'},
 {id:'safety',group:'출발 전 최종 확인',title:'Safety tips 앱 설치·방문객 핫라인 저장',note:'지진·재해 경보를 한국어로 받는 공식 앱과 24시간 한국어 상담 번호를 미리 준비합니다.'},
 {id:'ready',group:'출발 전 최종 확인',title:'eSIM·예약 QR·여권·방한용품 챙기기',note:'QR과 예약 확인서를 기기에 저장. 액체류 수하물 규정 확인. 12월 도쿄 평년 최고 12.0℃·최저 3.8℃라 저녁 야외 일정에 장갑·핫팩 준비.'},
]

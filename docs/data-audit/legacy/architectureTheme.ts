// cspell:words Takanawa safu horyuji nact LUFTBAUM nmwa nazacca
import type { TravelTheme, ThemeSpot } from './themes'
import type { ThemeEvidence } from './themeEvidence'

interface ArchitectureSpot extends ThemeSpot {
 visitorInfo: {hours:string;closed:string;admission:string;checkedAt:string;sourceUrl:string;note?:string}
}
const checkedAt='2026-10-18'
const evidence=(summary:string,officialUrl:string,photoPageUrl:string|null,verificationNote:string):ThemeEvidence=>({summary,officialUrl,photoPageUrl,checkedAt,photoNote:photoPageUrl?'공식 원문에서 시설·공간 사진을 확인할 수 있습니다. 사진 재사용 허가를 뜻하지 않습니다.':'공식 사진 원문 확인 필요',verificationNote})
const tnmVisit='https://www.tnm.jp/modules/r_free_page/index.php?id=113'
const spots:ArchitectureSpot[]=[
 {
  id:'architecture-mon',name:'MoN 다카나와 · 문화와 건축',kind:'place',address:'도쿄도 미나토구 미타 3-16-1',query:'MoN Takanawa 東京都港区三田3丁目16-1',
  note:'전시·공연과 공공 공간을 함께 둘러보는 문화시설입니다. 고층 정원과 이어지는 외관, 실내 프로그램을 골라 보고 싶은 후보입니다.',
  details:'공식 일반 안내는 10:00–21:00, 매월 둘째 화요일 휴관입니다. 테라스·점포·프로그램 시간은 다르며, 전시·공연별 티켓과 예약을 확인하세요. 다카나와 게이트웨이역 북개찰구에서 도보 약 6분, 센가쿠지역 A4에서 약 3분입니다. 공식 사업자 정보의 미타 3-16-1 주소를 확인했지만 실제 관람 입구는 접근 약도를 먼저 확인하세요.',
  officialUrl:'https://www.montakanawa.jp/en/visit/',verified:'공식 운영·접근 안내 확인 · 2026.10.18',
  references:[{title:'MoN 공식 · 운영·휴관',url:'https://www.montakanawa.jp/en/visit/schedule/'},{title:'MoN 공식 · 접근 약도',url:'https://www.montakanawa.jp/en/access/'},{title:'MoN 공식 · 주소가 기재된 사업자 정보',url:'https://montakanawa.jp/en/contact/form_03'}],
  visitorInfo:{hours:'일반 10:00–21:00 · 공간·점포·프로그램별 상이',closed:'매월 둘째 화요일(12월은 12/8) · 12/15는 정기 휴관일 아님 · 임시 휴관 별도 확인',admission:'전시·공연별 유료·예약 조건 확인',checkedAt,sourceUrl:'https://www.montakanawa.jp/en/visit/schedule/',note:'12월 프로그램·테라스 개방과 이용권은 미확정입니다.'},
  evidence:evidence('새로운 문화 프로그램과 여러 층의 공공 공간을 함께 살펴보는 후보입니다.','https://www.montakanawa.jp/en/visit/','https://www.montakanawa.jp/en/visit/','공식 접근·운영 안내 및 사업자 주소 확인. 12월 개별 프로그램과 예매 상태는 미확인입니다.'),
 },
 {
  id:'architecture-meiji',name:'메이지진구 뮤지엄',kind:'place',address:'도쿄도 시부야구 요요기카미조노초 1-1',query:'明治神宮ミュージアム 東京都渋谷区代々木神園町1-1',
  note:'숲과 조화를 이루는 완만한 지붕, 나무 사이 같은 로비가 특징인 구마 겐고 설계 전시관입니다. 신궁 관련 소장품과 숲을 바라보는 공간을 함께 살펴볼 수 있습니다.',
  details:'공식 일반 운영은 10:00–16:30, 입장 마감 16:00이며 목요일과 전시 교체 기간에 쉽니다. 하라주쿠역에서 도보 약 5분. 신궁 야외 참배와 미술관 입장권은 구분하세요. 현재 확인한 전시는 12/6까지여서 여행일의 다음 전시·교체 휴관은 추가 확인이 필요합니다.',
  officialUrl:'https://www.meijijingu.or.jp/museum/',verified:'공식 시설·운영 안내 확인 · 2026.10.18',
  references:[{title:'메이지진구 공식 · 뮤지엄',url:'https://www.meijijingu.or.jp/museum/'},{title:'공식 · 전시·교체 일정',url:'https://www.meijijingu.or.jp/museum/exhibitions/'}],
  visitorInfo:{hours:'10:00–16:30 · 최종 입장 16:00',closed:'목요일(공휴일 예외)·전시 교체 기간',admission:'일반 1,000엔 · 최신 권종 확인',checkedAt,sourceUrl:'https://www.meijijingu.or.jp/museum/',note:'12/6 이후 전시·교체 휴관과 여행일 운영 확인 필요'},
  evidence:evidence('숲과 낮은 지붕, 나무의 질감이 이어지는 전시 공간입니다.','https://www.meijijingu.or.jp/museum/','https://www.meijijingu.or.jp/museum/','건축·주소·일반 운영 확인. 12월 여행일 전시와 교체 휴관 미확인.'),
 },
 {
  id:'architecture-safu',name:'카페 다이닝 사후(茶楓) · 도모 미술관',kind:'place',address:'도쿄도 미나토구 도라노몬 4-1-35 · 기쿠치 간지쓰 기념 도모 미술관 건물 입구 오른쪽(층 미확인)',query:'カフェダイニング 茶楓 東京都港区虎ノ門4-1-35',
  note:'도모 미술관에 자리한 정원 전망 카페 다이닝입니다. 프렌치 기반 식사와 일본 재료를 활용한 디저트·차를 즐기며 쉬어갈 후보입니다.',
  details:'공식 운영은 11:00–18:00이며 식사 주문 마감 13:00, 카페·음료는 17:30입니다. 월요일 휴무라 12/14 방문 후보에서는 제외하세요. 가미야초역 4b에서 도보 약 6분. 정원·좌석 전망은 배정에 따라 다르고, 카페 이용과 미술관 관람 조건은 별도로 확인해야 합니다. 공식 공지의 대관일은 10/27·11/3·11/13이며 12월 대관 공지는 없습니다(10/18 기준). 예약은 이메일이고 회신에 며칠 걸릴 수 있습니다.',
  officialUrl:'https://safu.by-onko-chishin.com/en/',verified:'매장 공식 주소·시간·휴무 확인 · 2026.10.18',
  references:[{title:'매장 공식 · 운영·주소·접근',url:'https://safu.by-onko-chishin.com/en/'},{title:'운영사 발표 · 도모 미술관 내 위치',url:'https://prtimes.jp/main/html/rd/p/000000035.000118716.html'}],
  visitorInfo:{hours:'11:00–18:00 · 식사 주문 13:00 / 카페·음료 17:30 마감',closed:'월요일 · 공휴일이면 다음 화요일',admission:'음식·음료 주문 · 예약·대관 여부 확인',checkedAt,sourceUrl:'https://safu.by-onko-chishin.com/en/',note:'12/14(월) 정기 휴무 기준 방문 제외. 12월 대관·예약 미확인'},
  evidence:evidence('정원을 바라보며 식사나 차를 즐길 수 있는 미술관 부속 카페입니다.','https://safu.by-onko-chishin.com/en/','https://safu.by-onko-chishin.com/en/','공식 시간·주소 확인. 12월 예약·당일 좌석 및 미술관 관람 조건 미확인.'),
 },
 {
  id:'architecture-horyuji',name:'도쿄국립박물관 · 호류지 보물관',kind:'place',address:'도쿄도 다이토구 우에노코엔 13-9 · 도쿄국립박물관 안',query:'東京国立博物館 法隆寺宝物館',
  note:'다니구치 요시오 설계 건물의 인공 연못과 단정한 외관, 조용한 전시실을 살펴보는 후보입니다. 도쿄국립박물관 안의 별도 전시관이며 나라 호류지와 다릅니다.',
  details:'박물관 입장권과 정문 입장이 필요합니다. 12/14(월)은 정기 휴관, 12/15(화)은 공식 시설 점검 임시 휴관이라 두 날 모두 방문 대상으로 넣지 마세요. 다른 날짜로 기존 일정을 바꾸는 경우에만 검토합니다. 작품 보존상 전시실별 공개일이 다를 수 있어 방문일 전시를 확인하세요.',
  officialUrl:'https://www.tnm.jp/modules/r_free_page/index.php?id=119&lang=ja',verified:'공식 건축·휴관 안내 확인 · 2026.10.18',
  references:[{title:'도쿄국립박물관 공식 · 호류지 보물관',url:'https://www.tnm.jp/modules/r_free_page/index.php?id=119&lang=ja'},{title:'공식 · 2026년 휴관·관람권',url:tnmVisit}],
  visitorInfo:{hours:'일반 09:30–17:00 · 금·토 20:00까지 / 입장 30분 전 마감',closed:'월요일(공휴일 예외)·임시 휴관',admission:'박물관 컬렉션전 일반 1,000엔 · 특별전 별도',checkedAt,sourceUrl:tnmVisit,note:'12/14 정기 휴관 / 12/15 시설 점검 임시 휴관. 전시실별 공개 별도 확인'},
  evidence:evidence('연못과 절제된 선의 건축, 고대 미술 전시를 함께 보는 공간입니다.','https://www.tnm.jp/modules/r_free_page/index.php?id=119&lang=ja','https://www.tnm.jp/modules/r_free_page/index.php?id=119&lang=ja','박물관 안 전시관. 12/14와 12/15는 휴관 안내에 따라 제외.'),
 },
 {
  id:'architecture-nact',name:'국립신미술관',kind:'place',address:'도쿄도 미나토구 롯폰기 7-22-2',query:'国立新美術館 東京都港区六本木7-22-2',
  note:'물결치는 유리 외벽과 높은 로비가 인상적인 미술관입니다. 건물의 빛과 곡선을 구경하고 관심 전시나 카페를 골라 머무는 후보입니다.',
  details:'공식 일반 운영은 10:00–18:00, 입장 마감은 30분 전입니다. 화요일 휴관이므로 12/15 귀국일에 방문하지 마세요. 전시별 관람료·야간 연장·카페 시간은 다르며 건축 공간과 유료 전시 입장을 구분해야 합니다. 노기자카·롯폰기역 접근과 여행일 전시를 공식 안내에서 확인하세요.',
  officialUrl:'https://www.nact.jp/information/index.html',verified:'공식 주소·운영·층별 안내 확인 · 2026.10.18',
  references:[{title:'국립신미술관 공식 · 운영·휴관',url:'https://www.nact.jp/information/index.html'},{title:'공식 · 층별 공간·카페',url:'https://www.nact.jp/english/information/floormap/'}],
  visitorInfo:{hours:'일반 10:00–18:00 · 입장 30분 전 마감 / 전시별 연장 상이',closed:'화요일(공휴일이면 다음 평일)·별도 휴관',admission:'전시별 관람료·예약 조건 확인 · 카페 별도 주문',checkedAt,sourceUrl:'https://www.nact.jp/information/index.html',note:'12/15(화) 정기 휴관 기준 방문 제외. 12월 전시·건축 공간 이용 범위 재확인'},
  evidence:evidence('유리 외벽과 로비의 빛·곡선을 감상하는 미술 공간입니다.','https://www.nact.jp/information/index.html','https://www.nact.jp/english/information/floormap/','주소·일반 시간·화요일 휴관 확인. 전시별 요금과 12월 운영은 별도 확인.'),
 },
 {
  id:'architecture-loops',name:'LOOPS · 뉴우먼 다카나와',kind:'place',address:'도쿄도 미나토구 다카나와 2-21-1 · NEWoMan LUFTBAUM 28층',query:'LOOPS NEWoMan 高輪 LUFTBAUM 28F',
  note:'호텔 로비 같은 라운지와 고층 공간의 개방감을 즐기는 카페·바입니다(공식 매장 소개: 상징적인 혼 스피커가 있는 공간). 낮에는 식사·커피, 저녁에는 바 이용을 검토할 수 있습니다.',
  details:'공식 매장 시간은 점심 11:00–16:00(주문 마감 15:30), 카페 16:00–18:00, 저녁·바 18:00–23:00입니다. 음식 주문 마감 21:30, 음료 22:00. LUFTBAUM의 공공 공간 개방시간과 매장 영업은 다릅니다. 무료 전망대처럼 이용한다고 가정하지 말고 주문·3인 예약·행사나 대관 변경을 확인하세요. THE LINKPILLAR 1 North 28층으로, 다카나와 게이트웨이역 개찰구에서 도보 약 1분입니다.',
  officialUrl:'https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054',verified:'공식 층·주소·매장 시간 확인 · 2026.10.18',
  references:[{title:'뉴우먼 공식 · LOOPS 매장',url:'https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054'},{title:'뉴우먼 공식 · 주소·접근',url:'https://www.newoman.jp/takanawa/access/'}],
  visitorInfo:{hours:'점심 11:00–16:00(L.O. 15:30) / 카페 16:00–18:00 / 바 18:00–23:00',closed:'정기 휴무 미기재 · 시설·대관 공지 확인',admission:'식음료 주문 · 예약·좌석 조건 확인',checkedAt,sourceUrl:'https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054',note:'LUFTBAUM 28·29층 공간 개방(08:00–24:00, 공식)과 LOOPS 영업시간은 다릅니다. 12월 개별 일정 미확인'},
  evidence:evidence('라운지 분위기와 고층 개방감을 즐기는 카페·바입니다.','https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054','https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054','LUFTBAUM 28층 매장·일반 영업 확인. 시설 개방과 식음료 매장 이용을 구분.'),
 },
 {
  id:'architecture-forum',name:'도쿄 국제 포럼 · 유리 아트리움',kind:'place',address:'도쿄도 지요다구 마루노우치 3-5-1',query:'東京国際フォーラム ガラス棟',photoId:'spot-international-forum',
  note:'배의 뼈대처럼 펼쳐지는 유리와 철골을 공공 통로에서 올려다보는 건축 산책 후보입니다. 유라쿠초역·도쿄역 주변과 연결해 짧게 둘러볼 수 있습니다.',
  details:'공식 공공 공간은 일반 07:00–23:30에 자유 관람할 수 있지만 행사·수리로 제한될 수 있습니다. 7층 라운지와 G701은 대관 공간이라 이용 중에는 들어가지 마세요. 일반 개인 촬영도 통행 방해·삼각대 공간 점유·난간 밖 촬영을 피하고 현장 안내를 따르세요.',
  officialUrl:'https://www.t-i-forum.co.jp/access/access/',verified:'공식 공공 공간·촬영 규칙 확인 · 2026.10.18',
  references:[{title:'포럼 공식 · 주소·접근',url:'https://www.t-i-forum.co.jp/access/access/'},{title:'포럼 공식 · 자유 관람·사진·제한',url:'https://www.t-i-forum.co.jp/en/contact/faq/'}],
  visitorInfo:{hours:'공공 공간 일반 07:00–23:30',closed:'원칙 연중 운영 · 수리·행사 제한 가능',admission:'공공 공간 자유 관람 · 대관·행사 구역 별도',checkedAt,sourceUrl:'https://www.t-i-forum.co.jp/en/contact/faq/',note:'7층 라운지·G701 등 대관 구역은 일반 관람 대상에서 제외'},
  evidence:evidence('유리 아트리움의 구조를 공공 통로에서 감상하는 후보입니다.','https://www.t-i-forum.co.jp/access/access/','https://www.t-i-forum.co.jp/','공공 공간 관람 가능 시간과 대관·개인 촬영 제한을 공식 확인.'),
 },
 {
  id:'architecture-azabudai',name:'아자부다이 힐스 · 정원과 도시 건축',kind:'place',address:'도쿄도 미나토구 아자부다이 1-3-1 일대 · 건물별 입구 상이',query:'麻布台ヒルズ 東京都港区麻布台1-3-1',photoId:'views-azabudai',
  note:'곡선형 저층 건물과 정원, 고층 타워가 이어지는 도시 공간입니다. 공공 보행 공간 산책과 전시·식음료 시설 이용을 구분해서 고르세요.',
  details:'가미야초역 5번·롯폰기잇초메역 4번 출구와 연결됩니다. 점포·갤러리·옥외 공간마다 이용 시간이 다릅니다. 33·34층 스카이로비의 일반 대상 특별 개방은 2024/4/17 종료되었고, 이후에는 오피스 관계자와 지정 Hills House 시설 이용자 등이 대상입니다. 누구나 무료로 올라가는 전망대로 표시하지 않습니다. 카페·전시는 예약·요금·접근 조건을 별도로 확인하세요.',
  officialUrl:'https://www.azabudai-hills.com/access/',verified:'공식 접근·스카이로비 운영 변경 확인 · 2026.10.18',
  references:[{title:'아자부다이 힐스 공식 · 접근·공간별 안내',url:'https://www.azabudai-hills.com/access/'},{title:'운영사 공식 · 스카이로비 입장 대상 변경',url:'https://www.hillshouse.jp/news/20240327113059'}],
  visitorInfo:{hours:'공간·점포별 상이 · 방문 시설 시간 확인',closed:'시설·점포별 휴무 및 행사 제한 확인',admission:'옥외 보행 공간과 유료 전시·식음료 구분',checkedAt,sourceUrl:'https://www.azabudai-hills.com/information/index.html',note:'스카이로비 일반 무료 특별 개방 종료. 지정 시설 이용 대상·입장 조건 확인'},
  evidence:evidence('정원과 곡선 건물, 타워 사이를 잇는 도시 공간을 걸어보는 후보입니다.','https://www.azabudai-hills.com/access/','https://www.azabudai-hills.com/about/index.html','공식 접근 확인. 스카이로비는 일반 무료 전망대로 안내하지 않음.'),
 },
 {
  id:'architecture-tnm',name:'도쿄국립박물관 · 우에노',kind:'place',address:'도쿄도 다이토구 우에노코엔 13-9',query:'東京国立博物館 東京都台東区上野公園13-9',
  note:'일본 미술·고고 자료와 여러 전시관의 건축을 함께 둘러보는 후보입니다. 한 번에 전부 보기보다 관심 전시관과 작품을 미리 정해 방문하세요.',
  details:'우에노역 공원 출구에서 도보 약 10분. 정문 보안 검사와 관람권이 필요하며 캐리어는 반입할 수 없습니다. 12/14(월) 정기 휴관, 12/15(화) 시설 점검 임시 휴관입니다. 11/30–12/31 본관 17–20실·동양관, 12/14부터 본관 2–3실이 휴실이라 전체 관람을 보장하지 않습니다. 기존 필수 일정과 바꾸는 경우에만 다른 개관일을 검토하세요.',
  officialUrl:tnmVisit,verified:'공식 여행일 휴관·전시실 제한 확인 · 2026.10.18',
  references:[{title:'도쿄국립박물관 공식 · 2026년 운영·관람권',url:tnmVisit},{title:'박물관 공식 · 전시관·구내 지도',url:'https://www.tnm.jp/modules/r_free_page/index.php?id=114'}],
  visitorInfo:{hours:'일반 09:30–17:00 · 금·토 20:00까지 / 입장 30분 전 마감',closed:'월요일(공휴일 예외)·임시 휴관',admission:'컬렉션전 일반 1,000엔 · 특별전 별도',checkedAt,sourceUrl:tnmVisit,note:'12/14 정기 휴관 / 12/15 시설 점검 임시 휴관. 일부 전시실·동양관도 휴실 공지'},
  evidence:evidence('미술·고고 자료와 전시관 건축을 함께 즐기는 우에노의 박물관입니다.',tnmVisit,'https://www.tnm.jp/','공식 12/15 임시 휴관 및 12/14 월요일 휴관 확인. 여행 후반 이틀은 방문 제외.'),
 },
 {
  id:'architecture-nmwa',name:'국립서양미술관',kind:'place',address:'도쿄도 다이토구 우에노코엔 7-7',query:'国立西洋美術館 東京都台東区上野公園7-7',
  note:'서양 회화·조각 컬렉션과 미술관 건축을 함께 감상하는 후보입니다. 우에노에서 관심 작품을 먼저 정하고 상설전·기획전 중 방문 범위를 고르세요.',
  details:'공식 일반 안내는 09:30–17:30, 금·토 20:00까지이며 입장 마감은 30분 전입니다. 월요일 휴관이므로 12/14는 제외하세요. 기획전은 별도 요금·입장 조건이며 12/15는 귀국 이동을 우선해 추가하지 않습니다. 원칙적으로 매월 둘째 일요일(12/13)은 상설전 무료 관람일입니다.',
  officialUrl:'https://www.nmwa.go.jp/jp/visit/index.html',verified:'공식 이용 안내 확인 · 2026.10.18',
  references:[{title:'국립서양미술관 공식 · 관람 안내',url:'https://www.nmwa.go.jp/jp/visit/index.html',note:'운영시간·휴관·둘째 일요일 상설전 무료'},{title:'공식 · 일반 이용 안내(영문)',url:'https://www.nmwa.go.jp/en/visit/'}],
  visitorInfo:{hours:'일반 09:30–17:30 · 금·토 20:00까지 / 입장 30분 전 마감',closed:'월요일(공휴일이면 다음 날)·12/28–1/1·임시 휴관',admission:'상설전 일반 500엔 · 기획전 별도',checkedAt,sourceUrl:'https://www.nmwa.go.jp/jp/visit/index.html',note:'12/14 월요일 휴관 · 둘째 일요일(12/13)은 상설전 무료 관람일'},
  evidence:evidence('서양 미술과 건축을 함께 살펴보는 우에노의 미술관입니다.','https://www.nmwa.go.jp/jp/visit/index.html',null,'공식 이용 안내에서 주소·운영시간·휴관일·상설전 무료 관람일을 확인했습니다.'),
 },
]
export const architectureTheme:TravelTheme & {spots:ArchitectureSpot[]}={
 id:'architecture',title:'건축·미술 공간',description:'빛과 곡선, 정원과 전시를 천천히 둘러보고 싶은 10곳입니다. 기존 여행 일정에 자동 추가하지 않은 선택 후보입니다.',
 caution:'12/14(월)은 도쿄국립박물관·호류지 보물관·국립서양미술관·카페 사후의 정기 휴관·휴무 기준일입니다. 도쿄국립박물관은 12/15(화)도 임시 휴관, 국립신미술관은 화요일 휴관입니다. 귀국일에는 공항 이동을 우선하세요.',
 references:[{title:'공유 게시자 프로필 · nazacca',url:'https://www.instagram.com/nazacca/',note:'제공된 게시자 프로필입니다. 개별 게시물 원문 URL·사진 재사용 허가가 아닙니다.'}],spots,
}

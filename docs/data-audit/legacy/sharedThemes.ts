import type { TravelTheme, ThemeSpot } from './themes'

const pass = {title:'오다큐 · 에노시마·가마쿠라 프리패스',url:'https://www.odakyu-freepass.jp/enokama/buy.html',note:'출발역~후지사와 왕복1회 + 에노덴·후지사와~가타세에노시마 자유 승하차. 전체 구간 무제한이 아닙니다.'}
const medicine = {title:'PMDA · 일반의약품 설명서 검색',url:'https://www.pmda.go.jp/PmdaSearch/otcSearch/',note:'정확한 제품·성분·사용상 주의와 복용 중인 약을 약사에게 확인하세요.'}
const product = (id:string,name:string,brand:string,note:string,url:string):ThemeSpot => ({id,name,address:brand,query:name,kind:'product',note,details:'공유된 제품 관심 목록입니다. 치료·복용 추천이 아닙니다. 정확한 제품과 사용 가능 여부·상호작용·연령 조건은 약사와 설명서로 확인하세요. SNS의 효능·제품 간 우열 주장은 검증된 안내로 옮기지 않았습니다.',references:[{title:'제품·설명서 확인',url},medicine]})

export const sharedThemes:TravelTheme[] = [
 {id:'day-trips',title:'근교 당일치기',description:'에노시마·가마쿠라와 치바 철도 여행 후보입니다. 왕복 이동이 큰 일정이라 기존 5일 일정과 바꾸는 경우에만 별도로 계획하세요.',caution:'현재 일정에 배정하지 않은 후보입니다. 여름 후기의 풍경·혼잡·촬영 조건을 12월에도 같다고 가정하지 않습니다.',references:[pass,{title:'치바 모노레일 · 시야쿠쇼마에역',url:'https://chiba-monorail.co.jp/index.php/info-timetable/station-info/shiyakushomae-station/',note:'치바 방향 노선 확인. 도쿄에서 40분이라는 SNS 설명은 신바시 숙소 출발 소요시간이 아닙니다.'}],spots:[
  {id:'kamakura-crossing',name:'가마쿠라코코마에역 주변',address:'가나가와현 가마쿠라 · 에노덴 연선',query:'鎌倉高校前駅',note:'바다와 철길을 보고 싶은 후보입니다. 통제·인물 촬영 가능 여부는 공유 당시 후기이며 현재 상태 미확인.',photoId:'kamakura'},
  {id:'inamuragasaki',name:'이나무라가사키역 주변',address:'가나가와현 가마쿠라 · 에노덴 연선',query:'稲村ヶ崎駅',note:'열차 사진 후보. 사람이 없거나 통제가 없다는 후기 내용은 보장하지 않습니다.'},
  {id:'gokurakuji',name:'고쿠라쿠지역',address:'가나가와현 가마쿠라 · 에노덴 연선',query:'極楽寺駅',note:'역 주변 산책 후보입니다. 공유된 드라마 촬영 장면·촬영 위치는 미검증.'},
  {id:'enoshima-station',name:'에노시마역',address:'가나가와현 후지사와 · 에노덴',query:'江ノ島駅',note:'에노덴 에노시마역입니다. 오다큐 가타세에노시마역·쇼난 모노레일역과 구분하세요.'},
  {id:'enoshima-island',name:'에노시마 섬',address:'가나가와현 후지사와시 에노시마',query:'江の島',note:'섬 산책과 바다 풍경 후보. 드라마 속 라멘집 골목의 정확한 지점은 미확인.',photoId:'enoshima'},
  {id:'betanagi',name:'베타나기 · べたなぎ',address:'가나가와현 후지사와시 가타세카이간 1-11-29 · 섬 밖, 에노덴 에노시마역 도보 약 3분',query:'べたなぎ 藤沢市片瀬海岸1-11-29',note:'텐동 점심 식당입니다. 텐동 병맥주 세트 1,705엔, 에노시마 맥주 별도 900엔(공식 메뉴). 11:00–15:00·수요일 휴무.'},
  {id:'chiba-monorail',name:'치바 도시 모노레일',address:'시야쿠쇼마에역 → 치바역 방향',query:'市役所前駅 千葉モノレール',note:'매달린 형태의 열차와 도심 풍경을 보고 싶은 후보입니다. 실제 배차·차량·전면 시야는 당일 확인하세요.',photoId:'chiba-monorail',references:[{title:'운영사 · 역·시간표',url:'https://chiba-monorail.co.jp/index.php/info-timetable/station-info/shiyakushomae-station/'}]},
 ]},
 {id:'desserts',title:'카페·디저트',description:'공유한 말차·당고·케이크와 카페를 모았습니다. 후기의 순위·최초·최고 표현과 가격·대기시간은 사실로 확정하지 않았습니다.',caution:'TOP7 게시물은 제공된 본문에 6곳만 확인돼 7번째 가게를 임의로 채우지 않았습니다.',spots:[
  {id:'juchheim-ueno',name:'유하임 우에노점',address:'도쿄도 다이토구 우에노 3-29-5 · 마쓰자카야 우에노 본관1층',query:'ユーハイム 松坂屋上野店',note:'바움쿠헨을 먹어보고 싶은 후보. 즉석 커팅·중량 판매는 현 매장 안내 확인 필요.'},
  {id:'hatoya-asakusa',name:'하토야 아사쿠사 · 八十八 浅草',address:'도쿄도 다이토구 하나카와도 2-14-3',query:'八十八浅草 東京都台東区花川戸2-14-3',note:'교토 차 스탠드 八十八良葉舎의 아사쿠사 매장(八十八浅草)입니다. 말차 라테와 거품 말차(泡抹茶) 토핑 후보. 아사쿠사의 다른 「Hatoya」 찻집과 구분하세요.'},
  {id:'hana-asakusa',name:'차료 하나조 무카시노',address:'도쿄도 다이토구 아사쿠사 1-18-9',query:'茶寮花ぞむかしの 浅草1丁目18-9',note:'직화 치즈케이크와 호지차를 즐기는 카페입니다. 공식 LINE에서 매장 주소와 대표 메뉴를 확인했습니다.',officialUrl:'https://page.line.me/501puybv'},
  {id:'tabanenoshi',name:'아사쿠사 차야 타바네노시',address:'도쿄도 다이토구 아사쿠사 2-7-7',query:'浅草茶屋たばねのし 浅草2-7-7',note:'가케가와 말차 반죽·커스터드에 주문 후 브륄레한 말차 크레페 후보. 대기·품절은 당일 확인.',references:[{title:'타바네노시 공식 · 매장 목록(아사쿠사 본점)',url:'https://tabanenoshi.com/shopaccess/'},{title:'타바네노시 공식 · 가케가와 말차 브륄레',url:'https://tabanenoshi.com/works/kakegawagreenteabrulee/'}]},
  {id:'oiwake-dango',name:'오이와케 당고 혼포',address:'도쿄도 신주쿠구 신주쿠 3-1-22',query:'追分だんご本舗 新宿3-1-22',note:'미타라시 당고와 포장 후보. 영업·품절과 매장 이용 조건 확인 필요.'},
  {id:'nanaya-aoyama',name:'나나야 아오야마',address:'도쿄도 시부야구 시부야 2-7-12',query:'ななや 青山 渋谷2-7-12',note:'농도별 말차 아이스크림 후보. 아사쿠사 壽々喜園 협업점·교토 산조점과 다른 아오야마점입니다.'},
  {id:'tricolore',name:'긴자 토리코로루 본점',address:'도쿄도 주오구 긴자 5-9-17',query:'トリコロール本店 銀座5-9-17',note:'커피와 클래식한 실내 분위기를 보고 싶은 카페. 화요일 휴무 안내가 있어 12/15 귀국일 후보로 바로 넣지 마세요.',verified:'운영사·긴자 공식 상점 안내 · 2026.10.18',details:'운영사 공식 페이지 기준 08:00–19:00(주문 마감 18:30)이고 예약은 받지 않습니다. 휴무일은 매장 공식 인스타그램으로 안내하며, 긴자 공식 상점 안내는 화요일 휴무로 표기합니다. 12/15(화) 후보로 넣지 마세요.',references:[{title:'긴자 공식 · 토리코로루 본점',url:'https://www.ginza.jp/shop/873',note:'운영사 페이지(tricolore.co.jp)는 HTTPS를 지원하지 않아 링크하지 않았습니다. 운영사 표기는 08:00–19:00(L.O. 18:30)입니다.'}]},
  {id:'west-aoyama',name:'웨스트 아오야마 가든 · 긴자 웨스트',address:'도쿄도 미나토구 미나미아오야마 1-22-10',query:'ウエスト青山ガーデン 南青山1-22-10',note:'수플레·디저트 관심 카페. 이름에 긴자가 있어도 위치는 아오야마입니다.',verified:'공식 주소 확인 · 2026.10.17',details:'아오야마 가든 한정 핫 수플레 1,430엔(음료 세트 2,310엔), 11:00–18:00 주문, 굽는 데 약 20분 걸립니다(2026년 공식 메뉴). 좌석 예약은 받지 않습니다. 품절·대기는 당일 확인하세요. 앱 사진의 팬케이크는 수플레가 아닙니다.',references:[{title:'웨스트 공식 · 카페 소개·주소',url:'https://www.ginza-west.com/hpgen/HPB/categories/17547.html'}]},
 ]},
 {id:'convenience',title:'편의점 먹거리',description:'공유된 먹거리 관심 목록입니다. 브랜드·맛·정확한 제품명·판매 기간·점포 재고를 확인하고 고르세요.',spots:[
  {id:'seven-noodle',name:'몽고탄멘 나카모토 컵라면 · 辛旨味噌',address:'セブンプレミアム · 122g 259엔',query:'',kind:'product',note:'공유 후기의 컵라면·장조림·노른자 조합입니다. 정확한 제품과 조리 방법은 포장 안내를 확인하세요.'},
  {id:'seven-smoothie',name:'카페라테 스무디 · セブンカフェ',address:'セブン‐イレブン · 2025년 수량 한정',query:'',kind:'product',note:'공유된 카페라테 맛 스무디 후보. 시즌·점포별 판매와 제조 안내를 확인하세요.'},
  {id:'lawson-mochi',name:'모찌뿌요 · もちぷよ',address:'ローソン · 1개 127엔',query:'',kind:'product',note:'로손 공식 상품 페이지에 게재된 상품입니다. 후기의 순위 표현은 표시하지 않습니다.'},
  {id:'lawson-pasta',name:'카르보나라 · ソースたっぷり生パスタ(후보)',address:'ローソン · 646엔',query:'',kind:'product',note:'냉장 파스타 관심 목록입니다. 용량·메뉴·가열 방법·재고는 제품별 확인.'},
  {id:'seven-sweet-potato',name:'고구마맛탕 · カリッと 大学いも(후보)',address:'セブン‐イレブン · セブンプレミアム 냉동',query:'',kind:'product',note:'귀국 간식으로 소개한 관심 품목입니다(냉동 상품). 한국 반입 가능 여부는 별도 검역 안내를 확인하세요.'},
  {id:'mcdonalds-burger',name:'일본 맥도날드 버거 · 겨울 グラコロ 등',address:'日本マクドナルド · 메뉴명 미제공',query:'',kind:'product',note:'원문에 버거 이름이 없어 특정 메뉴·기간 한정 상품으로 확정하지 않았습니다.',references:[{title:'일본 맥도날드 · 현재 메뉴',url:'https://www.mcdonalds.co.jp/menu/'}]},
  {id:'cooler-bag',name:'보냉백 · Standard Products 保温トートバッグ(후보)',address:'Standard Products(다이소) · 330엔',query:'',kind:'product',note:'보냉백은 관심 품목입니다. 게시물의 300엔은 세금 제외 가격(세금 포함 330엔)과 같습니다. 500엔 제품은 확인하지 못했습니다.',details:'보냉백이 식품의 기내 반입·한국 검역 허용을 보장하지는 않습니다. 보안검색 후 구매한 식품도 도착국 반입 규정을 별도로 확인하세요. 푸딩·아이스팩 등은 액체·젤 제한과 항공사 기준을 확인하고 품목별 검역·신고 여부를 확인하세요.',references:[{title:'나리타공항 · 한국어 액체류 반입',url:'https://www.narita-airport.jp/ko/airportguide/security/liquid/'},{title:'관세청 · 반입 제한 물품 안내',url:'https://www2.customs.go.kr/busan/cm/cntnts/cntntsView.do?cntntsId=829&mi=7139'}]},
 ]},
 {id:'pharmacy',title:'약국 관심 품목',description:'공유된 제품 이름을 기억하기 위한 목록입니다. 개인별 치료·구매·복용 추천이 아니며, 약사 상담과 공식 설명서 확인을 먼저 하세요.',references:[medicine],spots:[
  product('rohto-premium','로토 V 프리미엄 · Vロートプレミアム','ロート製薬 · 제2류 15mL','제품 라인과 콘택트렌즈·사용 조건 확인이 필요한 관심 품목입니다.','https://jp.rohto.com/vrohto-premium-series/premium/'),
  product('taisho-patch','다이쇼 구내염 패치 · クイックケア(현행)','大正製薬 · 지정 제2류','패치 종류에 따라 성분과 사용 조건이 달라 정확한 제품명 확인이 필요합니다.','https://brand.taisho.co.jp/kounaien/product/'),
  product('miyaflora','미야플로라 · ミヤフローラEX','ミヤリサン製薬 · 지정 의약부외품','공유된 제품명입니다. 제조사 목록에서 제품·등급을 확인하세요. 다른 유산균보다 낫다는 비교는 검증하지 않았습니다.','https://www.miyarisan.com/product/'),
  product('biofermin','신비오페르민S · 錠/細粒','大正製薬(ビオフェルミン) · 지정 의약부외품','공유 글에서 비교 대상으로 언급한 제품입니다. 비추천·제품 간 우열은 그대로 반영하지 않고 공식 제품 정보만 연결합니다.','https://brand.taisho.co.jp/biofermin/product/s/'),
  product('chlomy','크로마이-N 연고 · クロマイ-N軟膏','第一三共ヘルスケア · 제2류','항생제·항진균 성분을 포함하는 의약품입니다. 모호한 피부 증상에 임의로 사용하도록 안내하지 않습니다.','https://www.daiichisankyo-hc.co.jp/site_chlomyn/product/'),
  product('nail-care','츠메큐어 · チュメキュア','小林製薬 · 제3류 의약품','공유명과 가장 가까운 공식 제품입니다. 외용 의약품이며 단순 손톱 영양제로 분류하지 않습니다.','https://www.kobayashi.co.jp/seihin/chmc/'),
  product('hepalize','헤파리제 · 라인 확인 필요','ゼリア新薬 · 의약품/청량음료 구분','라인별 분류와 성분을 확인하세요. 음주·피로를 이유로 복용하거나 선물하도록 추천하지 않습니다.','https://www.zeria.co.jp/hepa/'),
 ]},
 {id:'city-interests',title:'책방·음악·산책',description:'공유된 커피·책방·음악 공간을 모았습니다. 지점이나 정확한 명칭을 모르는 항목은 별도로 표시합니다.',spots:[
  {id:'ladrio',name:'진보초 라드리오',address:'도쿄도 지요다구 간다진보초 1-3',query:'ラドリオ 神田神保町1-3',note:'지요다구 관광협회가 일본에서 처음 비엔나커피를 낸 곳으로 소개하는 진보초 카페입니다.'},
  {id:'bondy',name:'커리 본디',address:'도쿄도 지요다구 간다진보초 2-3 · 간다고쇼센터 2층(진보초 본점 기준)',query:'ボンディ 神保町本店 神田古書センタービル2F',note:'커리를 먹어보고 싶은 후보. 진보초 본점 기준이며 공유글의 지점이 본점인지는 미확인. 간다오가와마치·오테마치·아키하바라 지점은 시간이 다릅니다.'},
  {id:'starbucks-roastery',name:'스타벅스 리저브 로스터리 도쿄',address:'도쿄도 메구로구 아오바다이 2-19-23',query:'スターバックス リザーブ ロースタリー 東京',note:'커피와 공간을 구경할 후보입니다. 입장·대기·매장 운영 확인 필요.'},
  {id:'kioi-seido',name:'기오이 세이도 · 紀尾井清堂',address:'도쿄도 지요다구 기오이초 3-1',query:'紀尾井清堂 千代田区紀尾井町3-1',note:'현재 일반 비공개입니다. 외관만 볼 수 있으며 견학·이용 신청은 받지 않습니다.'},
 ]},
]

export const additionalFood:ThemeSpot[]=[
 {id:'pizza-shinagawa',name:'400℃ 피자 시나가와',address:'도쿄도 미나토구 다카나와 4-22-11 · 빌리지 다카나와1층',query:'400℃ PIZZA SHINAGAWA',note:'공유된 FNT 피자를 먹어보고 싶은 후보. 3인 좌석·예약·주문 조건을 확인하세요.',verified:'TableCheck 조건 확인 · 2026.10.17',details:'매장 지정 예약 페이지는 방문7일 전13:00 예약 시작, 신용카드 필요(직불카드 불가), 1인 피자1판·음료1잔, 만6세 이상, 65분 이용을 안내합니다. 카운터1~4인·반개인실3~4인·테이블2인으로 좌석 조건이 다릅니다. 결제·취소 규정은 예약 직전 재확인하세요. 예약·결제는 하지 않았습니다.',references:[{title:'매장 지정 · 한국어 TableCheck 예약 안내',url:'https://www.tablecheck.com/ko/shops/400-yonhyakudo-shinagawa/reserve'}]},
]
export const additionalNight:ThemeSpot[]=[
 {id:'funabori',name:'타워홀 후나보리 전망실',address:'도쿄도 에도가와구 후나보리 4-1-1',query:'タワーホール船堀 展望塔',photoId:'funabori',note:'공식 시설 안내: 타워115m·전망실103m, 엘리베이터09:00–21:30. 공식 FAQ에서 무료 확인. 휴관·날씨 제한은 방문 전 확인하세요.',verified:'시설·구청 안내 확인 · 2026.10.17',details:'건물·주차장 이용시간과 전망 엘리베이터 운영시간은 다릅니다. 강풍 등 기상에 따라 운행을 멈출 수 있습니다. 도쿄3대 타워라는 순위는 확정 정보로 사용하지 않았습니다.',references:[{title:'타워홀 공식 · 전망실 안내',url:'https://www.towerhall.jp/faq/'},{title:'에도가와구 · 시설·접근 안내',url:'https://www.city.edogawa.tokyo.jp/e026/kuseijoho/gaiyo/shisetsuguide/bunya/bunkachiiki/towerhall/gaiyo.html'}]},
]

const sourceProfiles:Record<string,string>={
 'day-trips':'on.leeuu',desserts:'gge.juck',convenience:'meomuknam',pharmacy:'beige_yaksa','city-interests':'hello._.hani',
}
for(const theme of sharedThemes){
 const profile=sourceProfiles[theme.id]
 if(profile)theme.references=[...(theme.references??[]),{title:'공유 게시자 프로필 · 게시물 원문 URL 미제공',url:'https://www.instagram.com/'+profile+'/',note:'사용자가 제공한 본문을 한국어로 요약했습니다. 이 링크는 게시물 원문이 아닌 게시자 프로필이며 공식 검증 근거와 구분합니다.'}]
}

export const supplementalReferences:Record<string,{photoId?:string;photoIds?:string[];references?:ThemeSpot['references']}>= {
 'juchheim-ueno':{references:[{title:'유하임 공식 · 매장 검색',url:'https://www.juchheim.co.jp/shop_search',note:'마쓰자카야 우에노점 주소 확인. 즉석 판매 방식·재고는 별도 확인.'}]},
 'hana-asakusa':{references:[{title:'차료 하나조 무카시노 · 공식 매장·메뉴',url:'https://page.line.me/501puybv',note:'주소·직화 치즈케이크·11:00–18:00·수요일 휴무 확인. 방문일 변경 안내 확인.'}]},
 tabanenoshi:{references:[{title:'공유 매장 계정 · 메뉴·운영 확인',url:'https://www.instagram.com/asakusachaya_tabanenoshi/',note:'공유된 계정 링크이며 현재 메뉴·대기시간을 검증한 자료는 아닙니다.'}]},
 'oiwake-dango':{references:[{title:'오이와케 당고 공식 · 매장 안내',url:'https://oiwakedango.co.jp/'}]},
 'nanaya-aoyama':{references:[{title:'나나야 아오야마 공식 계정 · 운영 안내',url:'https://x.com/nanaya_aoyama/with_replies',note:'공식 계정의 화요일 휴무 안내 확인. 방문일 재확인.'}]},
 tricolore:{photoId:'tricolore'},
 'starbucks-roastery':{photoId:'roastery',photoIds:['roastery-inside']},
}

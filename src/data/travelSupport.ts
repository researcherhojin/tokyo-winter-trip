export const bookingPage = 'https://app.notion.com/p/3fc6d10af85a81aa807cddf97bad666c'
export const reservations = {
 harry: {date:'2026-12-13',time:'10:00',title:'해리포터 10:00 입장',note:'사용자 지정 시간 · 예매·결제는 별도 확인',source:bookingPage},
 poke: {date:'2026-12-12',time:'11:00',end:'12:00',title:'포레스트 11:00–12:00 입장',note:'Trainer’s Pass 3장 원문 확인 · 관람 종료시간이 아닌 입장 가능 시간',source:bookingPage},
}
export interface DaySupport {priority:string;delay:string;protectedTime:string;alternatives:string[]}
export const daySupport:Record<number,DaySupport> = {
 1:{priority:'짐을 맡긴 뒤 오다이바와 도쿄타워 야경',delay:'입국이 늦으면 오다이바 체류를 줄이고 숙소 짐 보관·저녁 시간을 먼저 확보하세요.',protectedTime:'항공편 08:35 출발 · 10:55 도착',alternatives:['tower-night','odaiba-night']},
 2:{priority:'Trainer’s Pass의 포레스트 입장 시간 준수',delay:'시내 쇼핑을 추가하지 말고 포레스트 입장을 먼저 확보하세요. 이동이 지연되면 곤돌라 외 공식 접근편을 확인하세요.',protectedTime:'포레스트 11:00–12:00 입장 · 티켓 3장 확인',alternatives:['character-yomiuri']},
 3:{priority:'해리포터 10:00 입장 · 오후 이케부쿠로',delay:'관람이 길어지면 선택 일정인 MEGA TOKYO부터 줄이세요. 저녁 장소가 정해지면 역산해 쇼핑을 마칩니다.',protectedTime:'해리포터 10:00 입장 계획 · 결제 별도 확인',alternatives:['character-mega','character-harry']},
 4:{priority:'전망대 예약시간과 아키하바라 매장 마감',delay:'간식 대기와 강변 산책을 줄이고 전망대 입장·쇼핑 시간을 우선하세요.',protectedTime:'전망대 15:10 입장 계획 · 예약 미확인',alternatives:['hatoya-asakusa','tabanenoshi','character-skypokemon']},
 5:{priority:'짐 회수와 나리타 T2 이동',delay:'츠키지·긴자 체류를 줄이고 12:30 짐 회수, 13:15 공항 이동 계획을 우선하세요.',protectedTime:'나리타 T2 15:30–16:00 도착 목표 · 18:55 출발',alternatives:['ginza-night']},
}
export const nearbyQueries:Record<string,{area:string;indoor:string}> = {
 narita:{area:'成田空港 第2ターミナル',indoor:'成田空港 第2ターミナル レストラン'},
 shinbashi:{area:'新橋駅',indoor:'新橋 カフェ'},lodging:{area:'東京都港区新橋5丁目29',indoor:'新橋 カフェ'},
 odaiba:{area:'お台場海浜公園',indoor:'アクアシティお台場'},tower:{area:'東京タワー',indoor:'東京タワー フットタウン'},
 yomiuri:{area:'よみうりランド',indoor:'よみうりランド レストラン'},harry:{area:'ワーナーブラザース スタジオツアー東京',indoor:'スタジオツアー東京 フードホール'},
 starwars:{area:'池袋PARCO',indoor:'池袋PARCO レストラン'},mega:{area:'サンシャインシティ',indoor:'サンシャインシティ レストラン'},
 sensoji:{area:'浅草寺',indoor:'浅草 カフェ'},skytree:{area:'東京スカイツリー',indoor:'東京ソラマチ'},skypokemon:{area:'東京ソラマチ',indoor:'東京ソラマチ レストラン'},
 akihabara:{area:'秋葉原駅',indoor:'秋葉原 カフェ'},tsukiji:{area:'築地場外市場',indoor:'築地 カフェ'},ginza:{area:'銀座',indoor:'銀座 カフェ'},
}

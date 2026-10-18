// cspell:words otokozaka kinshi kameari kochikame fujitv gyoen durarara lycoris kappabashi kamakurakokomae
import type { TravelTheme, ThemeSpot } from './themes'
import type { ThemeEvidence } from './themeEvidence'

const checkedAt = '2026-10-18'
const goTokyo88 = 'https://www.gotokyo.org/jp/anime-and-manga/animetourism88/index.html'
const manners = '주택가·신사·계단에서는 조용히 하고 통행을 막지 않습니다. 삼각대·장시간 촬영은 피하세요.'
const evidence = (summary:string, officialUrl:string, verificationNote:string, photoId:string):ThemeEvidence => ({summary, officialUrl, photoPageUrl:null, checkedAt, photoId, photoNote:'애니메이션 장면 이미지는 저작권 때문에 싣지 않고, 같은 장소의 실제 사진만 공개 라이선스로 보여줍니다.', verificationNote})
const open = (note:string, sourceUrl:string|null, hours='상시 통행 가능한 공공 공간 · 시설 운영시간과 구분', closed='정기 휴무 없음 · 행사·공사 통제 확인') => ({hours, closed, admission:'무료 · 주변 시설 이용은 별도', checkedAt, sourceUrl, note})
const spots:ThemeSpot[] = [
 {
  relation:'작품 등장',id:'anime-suga-shrine-stairs',name:'스가 신사 계단(오토코자카) · 너의 이름은',kind:'place',address:'도쿄도 신주쿠구 스가초 5 · 스가 신사 남쪽 계단',query:'須賀神社 男坂 東京都新宿区須賀町5',photoId:'anime-suga-shrine-stairs',
  note:'신카이 마코토 감독의 『너의 이름은』(2016)에 등장해 유명해진 스가 신사 남쪽 돌계단(오토코자카)입니다.',
  details:'스가 공원 동쪽 입구 옆에서 북동쪽으로 내려가는 가파른 돌계단입니다. 좁은 주택가 계단이라 사진은 짧게 찍고 계단 한가운데를 막지 마세요.',
  officialUrl:'https://bunkakanko-annai.city.shinjuku.lg.jp/shosai3/?id=B084',verified:'신주쿠구 공식 문화·관광 안내 확인 · 2026.10.18',
  references:[{title:'『너의 이름은』 공식 예고편 · 도호 MOVIE 채널',url:'https://www.youtube.com/watch?v=k4xGqY5IDBE',note:'공식 영상 · 이 장소 장면은 영상에서 확인하지 못함'},{title:'신주쿠구 문화·관광 안내 · 스가 신사 오토코자카',url:'https://bunkakanko-annai.city.shinjuku.lg.jp/shosai3/?id=B084',note:'「君の名は。」(2016)에 등장해 유명해진 돌계단이라고 소개'},{title:'『너의 이름은』 공식 사이트',url:'https://www.kiminona.com/',note:'공식 예고편·키 비주얼'}],
  visitorInfo:open(manners,'https://bunkakanko-annai.city.shinjuku.lg.jp/shosai3/?id=B084','계단은 상시 통행 가능 · 신사 사무소 시간은 별도','정기 휴무 없음 · 제례·행사 통제 확인'),
  evidence:evidence('『너의 이름은』에 등장한 스가 신사 오토코자카 계단입니다.','https://bunkakanko-annai.city.shinjuku.lg.jp/shosai3/?id=B084','신주쿠구 공식 문화·관광 안내에서 작품 등장 사실을 확인했습니다.','anime-suga-shrine-stairs'),
 },
 {
  relation:'작품 등장',scene:{title:'『언어의 정원』 공식 예고편 · 코믹스 웨이브 필름',url:'https://www.youtube.com/watch?v=udDIkl6z8X0&t=69s',youtubeId:'udDIkl6z8X0',start:69,moment:'1:09 · 비 오는 정원의 정자 장면'},id:'anime-shinjuku-gyoen',name:'신주쿠교엔 · 언어의 정원',kind:'place',address:'도쿄도 신주쿠구 나이토마치 11',query:'新宿御苑 東京都新宿区内藤町11',photoId:'anime-shinjuku-gyoen',
  note:'신카이 마코토 감독의 『언어의 정원』 주무대인 국민정원입니다. 비 오는 날 정원의 정자가 두 사람의 만남 장소로 나옵니다.',
  details:'10/1~3/14은 9:00–16:30(입장 16:00까지), 일반 500엔입니다. 월요일 휴원이라 12/14(월)에는 들어갈 수 없고 12/12(토)에 신주쿠를 지날 때가 맞습니다. 영화 속 정자의 정확한 위치는 공식 자료로 특정하지 않았습니다. 주류 반입은 금지입니다.',
  officialUrl:'https://www.japan.travel/ko/spot/1659/',verified:'일본정부관광국·환경성 공식 안내 확인 · 2026.10.18',
  references:[{title:'일본정부관광국 · 신주쿠교엔(언어의 정원 무대)',url:'https://www.japan.travel/ko/spot/1659/'},{title:'환경성 · 신주쿠교엔 이용 안내',url:'https://policies.env.go.jp/national-garden/shinjukugyoen/guide/information/'},{title:'환경성 · 신주쿠교엔 이용 규칙(주류 반입 금지)',url:'https://policies.env.go.jp/national-garden/shinjukugyoen/guide/rule/'}],
  visitorInfo:{hours:'10/1~3/14 9:00–16:30 · 입장 16:00까지',closed:'월요일(공휴일이면 다음 평일)·12/29~1/3 · 12/14(월) 휴원',admission:'일반 500엔',checkedAt,sourceUrl:'https://policies.env.go.jp/national-garden/shinjukugyoen/guide/information/',note:'12/12(토) 신주쿠 경유 시 검토 · 주류 반입 금지'},
  evidence:evidence('『언어의 정원』의 무대인 신주쿠교엔 일본정원입니다.','https://www.japan.travel/ko/spot/1659/','일본정부관광국 공식 소개의 작품 무대 설명과 환경성 공식 운영시간·휴원일을 확인했습니다.','anime-shinjuku-gyoen'),
 },
 {
  relation:'작품 무대',id:'anime-fujitv-odaiba',name:'오다이바 · 디지몬 어드벤처',kind:'place',address:'도쿄도 미나토구 다이바 2-4-8 · 후지TV 구체 전망실 「하치타마」',query:'フジテレビ本社ビル はちたま',photoId:'anime-fujitv-odaiba',
  note:'도쿄도 교통국과 유리카모메가 『디지몬 어드벤처』의 무대로 소개한 오다이바 지역입니다. 후지TV 구체 전망실 「하치타마」에서 이 일대를 내려다볼 수 있습니다.',
  details:'전망실은 10:00–18:00(입장은 종료 30분 전까지), 일반 800엔입니다. 월요일 휴관이라 12/14(월)에는 들어갈 수 없고, 12/11 오다이바 일정과 가깝습니다. 디지몬 25주년 스탬프랠리(2024.12.19~2025.2.6)는 끝났습니다.',
  officialUrl:'https://www.kotsu.metro.tokyo.jp/pickup_information/news/pdf/2024/sub_p_2024121111824_h_01.pdf',verified:'도쿄도 교통국 보도자료·후지TV 공식 안내 확인 · 2026.10.18',
  references:[{title:'『디지몬』 25주년 공식 PV · 디지몬 공식 채널',url:'https://www.youtube.com/watch?v=-LyODOfv8Sw',note:'공식 영상 · 이 장소 장면은 영상에서 확인하지 못함'},{title:'도쿄도 교통국 · 디지몬 25주년 스탬프랠리(오다이바)',url:'https://www.kotsu.metro.tokyo.jp/pickup_information/news/pdf/2024/sub_p_2024121111824_h_01.pdf',note:'오다이바를 작품 무대로 소개'},{title:'후지TV 공식 · 견학 안내(하치타마)',url:'https://www.fujitv.com/ja/visit_fujitv/'}],
  visitorInfo:{hours:'10:00–18:00 · 입장은 종료 30분 전까지',closed:'월요일(공휴일이면 다음 평일) · 12/14(월) 휴관',admission:'일반(고등학생 이상) 800엔 · 초·중학생 500엔',checkedAt,sourceUrl:'https://www.fujitv.com/ja/visit_fujitv/',note:'후지TV 공식 안내 기준 · 악천후 시 임시 휴관 가능'},
  evidence:evidence('『디지몬 어드벤처』의 무대로 소개된 오다이바와 후지TV 구체 전망실입니다.','https://www.kotsu.metro.tokyo.jp/pickup_information/news/pdf/2024/sub_p_2024121111824_h_01.pdf','도쿄도 교통국 보도자료로 오다이바가 작품 무대임을, 후지TV 공식 안내로 전망실 운영을 확인했습니다.','anime-fujitv-odaiba'),
 },
 {
  relation:'공식 협업',id:'anime-kanda-myojin-otokozaka',name:'간다묘진 · 러브라이브!',kind:'place',address:'도쿄도 지요다구 소토칸다 2-16-2',query:'神田明神',photoId:'anime-kanda-myojin-otokozaka',
  note:'GO TOKYO가 『러브라이브!』와 인연이 깊다고 소개하는 신사로, 2015년 간다마쓰리 때 작품과 협업했습니다.',
  details:'12/14 아키하바라 일정과 묶기 좋습니다. GO TOKYO는 「작품에 나오는 간다묘진 근처 언덕」이라고만 쓰고 정확한 계단을 특정하지 않습니다. 사진은 신사 옆 묘진 오토코자카 계단입니다. 실제 참배하는 신사이고 계단은 주민 통행로이니 앉거나 막지 마세요.',
  officialUrl:goTokyo88,verified:'GO TOKYO 공식 애니메이션 성지 88 확인 · 2026.10.18',
  references:[{title:'『러브라이브!』 공식 영상 · 러브라이브! 시리즈 공식 채널',url:'https://www.youtube.com/watch?v=xExfyRYIXco',note:'공식 영상 · 이 장소 장면은 영상에서 확인하지 못함'},{title:'GO TOKYO · 애니메이션 성지 88(간다묘진)',url:goTokyo88,note:'2015년 대제례 때 「러브라이브!」와 협업'}],
  visitorInfo:open('실제 참배 신사 · 계단은 주민 통행로',goTokyo88,'경내 참배 가능 · 시설별 시간 별도','정기 휴무 없음 · 제례 통제 확인'),
  evidence:evidence('『러브라이브!』와 인연이 깊은 간다묘진입니다.',goTokyo88,'GO TOKYO 공식 애니메이션 성지 88에서 작품과 간다묘진의 협업을 확인했습니다.','anime-kanda-myojin-otokozaka'),
 },
 {
  relation:'작품 무대',scene:{title:'『사라잔마이』 공식 PV · 후지TV 애니메이션 공식 채널',url:'https://www.youtube.com/watch?v=MbQHJA_QT1g&t=19s',youtubeId:'MbQHJA_QT1g',start:19,moment:'0:19 · 갓파바시의 황금 갓파 동상 장면'},id:'anime-kappabashi',name:'갓파바시 도구거리 일대 · 사라잔마이',kind:'place',address:'도쿄도 다이토구 마쓰가야 · 갓파바시 도구거리 일대',query:'かっぱ橋道具街',photoId:'anime-kappabashi',
  note:'다이토구가 『사라잔마이』에서 갓파바시 주변과 아사쿠사의 풍경이 자세히 그려졌다고 소개하는 거리입니다.',
  details:'특정 지점이 아니라 갓파바시·아사쿠사 일대가 무대입니다. 12/14 아사쿠사 일정과 걸어서 이어집니다. 도구 상점가라 가게 앞 통행을 막지 마세요.',
  officialUrl:'https://www.city.taito.lg.jp/kusei/sanka/release/2021/202104/press0413.html',verified:'다이토구 공식 보도자료 확인 · 2026.10.18',
  references:[{title:'다이토구 보도자료 · 사라잔마이',url:'https://www.city.taito.lg.jp/kusei/sanka/release/2021/202104/press0413.html',note:'갓파바시 주변과 아사쿠사 지역 풍경이 자세히 그려짐'}],
  visitorInfo:open('상점별 영업시간은 개별 확인','https://www.city.taito.lg.jp/kusei/sanka/release/2021/202104/press0413.html','거리는 상시 통행 · 점포 영업시간 별도','점포별 휴무 확인'),
  evidence:evidence('『사라잔마이』의 무대인 갓파바시·아사쿠사 일대입니다.','https://www.city.taito.lg.jp/kusei/sanka/release/2021/202104/press0413.html','다이토구 공식 보도자료에서 작품 무대를 확인했습니다. 특정 지점은 지정되지 않았습니다.','anime-kappabashi'),
 },
 {
  relation:'작품 무대',id:'anime-kamakurakokomae-crossing',name:'가마쿠라고교마에역 앞 건널목 · 슬램덩크',kind:'place',address:'가나가와현 가마쿠라시 고시고에 1-1 · 에노덴 가마쿠라고교마에역 옆',query:'鎌倉高校前1号踏切',photoId:'anime-kamakurakokomae-crossing',
  note:'가나가와현 관광 공식 사이트가 『슬램덩크』의 현장으로 유명하다고 소개하는 건널목입니다.',
  details:'가마쿠라·에노시마 당일치기 후보와 같은 노선입니다. 가마쿠라시 조례는 차도에 멈춰 서서 차량을 막거나 선로 주변 같은 위험한 곳에서 촬영하는 것을 금지합니다. 주민 생활 도로이니 짧게 보고 이동하세요.',
  officialUrl:'https://trip.pref.kanagawa.jp/destination/kamakurakokomae-station/988',verified:'가나가와현 관광 공식·가마쿠라시 조례 확인 · 2026.10.18',
  references:[{title:'가나가와현 관광 공식 · 가마쿠라코코마에역',url:'https://trip.pref.kanagawa.jp/destination/kamakurakokomae-station/988',note:'슬램덩크의 현장으로 유명한 건널목'},{title:'가마쿠라시 · 공공장소 매너 조례(PDF)',url:'https://www.city.kamakura.kanagawa.jp/kankou/documents/manner.pdf',note:'차도·선로 주변 촬영 금지'}],
  visitorInfo:open('차도·선로 주변 촬영 금지(가마쿠라시 조례)','https://www.city.kamakura.kanagawa.jp/kankou/documents/manner.pdf','건널목은 상시 통행 · 열차 운행 시간 주의','정기 휴무 없음'),
  evidence:evidence('『슬램덩크』의 현장으로 소개되는 가마쿠라고교마에역 앞 건널목입니다.','https://trip.pref.kanagawa.jp/destination/kamakurakokomae-station/988','가나가와현 관광 공식 사이트의 소개와 가마쿠라시 촬영 매너 조례를 확인했습니다.','anime-kamakurakokomae-crossing'),
 },
]
export const animeTheme:TravelTheme = {
 id:'anime-places',title:'애니 속 도쿄',description:'구청·관광청 같은 공식 자료가 작품에 등장했거나(작품 등장) 작품의 무대로 소개한 곳(작품 무대), 작품과 공식 협업한 곳(공식 협업)입니다. 카드마다 관계를 표시하고, 공식 영상에서 장면을 확인한 곳은 현지 사진 옆에서 그 장면부터 재생합니다.',
 caution:'성지순례 후보이며 날짜별 일정에 자동 추가하지 않습니다. 주택가·신사·건널목에서는 조용히 하고 통행을 막지 마세요. 장면 이미지는 저작권 때문에 앱에 저장하지 않고 공식 영상을 재생합니다. 장면 비교는 공식 영상에서 해당 장면을 직접 확인한 곳에만 둡니다.',spots,
}

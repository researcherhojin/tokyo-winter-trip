# 일정·장소 자료 검증 기록

최초 일정 확인일: **2026-10-17**, 장소 방문 가이드 보강: **2026-10-18**. 원본 Notion 페이지를 연결 도구로 읽고 일정과 주의사항을 반영했습니다. Notion의 native verification은 unverified이며 여행자 계획의 근거로만 사용했습니다. 응답에 별도의 truncated/unknown_block 플래그는 없었습니다. 인라인 데이터베이스와 첨부 티켓·이미지·PDF의 내부 내용은 읽지 않았습니다.

## 장소 상세 가이드의 근거와 계획 구분

`src/data/places.json`의 15곳에 `guide`를 추가했습니다. 소개(`overview`), 추천 동선(`visitPlan`), 접근(`access`), 현장 확인(`tips`), 비용 범위(`budget`), 출처(`sources`), 작성 기준일(`checkedAt`)을 같은 형식으로 제공합니다. 추천 동선은 시설이 보장한 코스나 예약이 아니라 우리 시간표에 맞춘 제안입니다. 기존 좌표·좌표 정밀도·예약 상태를 바꾸지 않았습니다. `guide.checkedAt`은 가이드 정리·자료 대조일이며 숙소 예약이나 여행 당일 운영이 확정됐다는 의미가 아닙니다.

2026-10-18 공식 페이지를 직접 열어 확인한 자료는 다음과 같습니다. 원문 사진은 다운로드하지 않았습니다.

| 대상 | 공식 근거 | 반영·미확정 범위 |
| --- | --- | --- |
| 해리포터 | [전시·체험](https://www.wbstudiotour.jp/the-experience/activity/), [접근](https://www.wbstudiotour.jp/plan-your-visit/location/) | 대연회장·9¾ 승강장·제작 전시, 토시마엔역 도보 약 2분. 4시간 30분 체류는 여행 계획이며 10:00 예매·결제는 미확인 |
| 포케파크 | [공식 권종·정리권·포레스트 조건](https://www.pokepark-kanto.co.jp/ppark/ticketInfo/type/index) | Trainer’s Pass는 지정시간 1회·재입장 불가, Town Pass는 포레스트 불가. 일부 정리권은 요미우리랜드 입장 후 10:45부터 앱 신청. 110계단·경사 조건. 12/12 운영·실제 구매 권종은 미확정 |
| 요미우리랜드 | [공식 교통 안내](https://www.yomiuriland.com/traffic/) | 게이오요미우리랜드역 접근·곤돌라 안내. 12월 운행·막차는 당일 조건 재확인 |
| 포켓몬센터 | [MEGA TOKYO](https://shop.pokemon.co.jp/en/shop/pokemoncenter-megatokyo/), [SKYTREE TOWN](https://shop.pokemon.co.jp/en/shop/pokemoncenter-skytreetown/) | 각각 alpa 2F·소라마치 East Yard 4F. 일반 영업 10–20시·10–21시, MEGA TOKYO의 주변 시설·역 접근. 12월 휴업·상품 재고·행사는 미보장 |
| 도쿄타워 | [요금·영업](https://en.tokyotower.co.jp/fee/), [접근](https://en.tokyotower.co.jp/access/) | 메인덱 150m·톱덱 250m 구분. 일반 성인 메인덱 1,500엔·톱덱 웹 3,300엔/창구 3,500엔은 조회일 값이며 12/11 재확인 |
| 스카이트리 | [층별·운영 안내](https://www.tokyo-skytree.jp/), [공식 티켓](https://www.tokyo-skytree.jp/ticket/) | 350m 덴보데크·450m 덴보회랑과 권종 구분. 홈페이지 오늘 일몰을 12/14 일몰로 사용하지 않음. 영어 주소 접근 실패 후 일본어 공식 원문 대조 |
| 스타워즈 | [개점·층수](https://benelicstore.com/info/news/20260902_storenews/), [10/13 입장 공지](https://benelicstore.com/info/news/star-wars-store-by-benelic%E6%B1%A0%E8%A2%8B%E3%83%91%E3%83%AB%E3%82%B3%E5%BA%97%E3%80%80%E5%85%A5%E5%BA%97%E4%BA%88%E7%B4%84%E5%88%B6%E7%B5%82%E4%BA%86%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B/) | 本館6F·一般11–21시와 일반 입장 예약제 종료 재확인. 커스텀 상품·와펜은 공유 본문과 공식 커스텀 코너 안내를 함께 참고하며 재고·체험 조건·소요시간은 미확정 |
| 센소지 | [공식 경내 소개](https://www.senso-ji.jp/english/) | 도쿄에서 가장 오래된 사찰·경내 시설명 대조. 카미나리몬→본당→점심 순서는 추천 동선 |
| 츠키지 | [공식 방문·예절](https://www.tsukiji.or.jp/english/how-to-enjoy/) | 오전9시 전 전문 구매자 통행 우선, 지정 공간 취식·촬영 허락·큰 짐 보관 안내. 점포별 가격·휴무는 미확정 |
| 오다이바·긴자·아키하바라 | [오다이바](https://www.gotokyo.org/en/spot/39/index.html), [긴자](https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html), [아키하바라](https://www.gotokyo.org/en/destinations/central-tokyo/akihabara/index.html) | GO TOKYO 공식 지역 소개·공원 특징. 개별 점포 영업·사진 위치·수집품 시세는 보장하지 않음 |
| 긴자 카페 | [긴자 공식 토리코로루](https://www.ginza.jp/shop/873) | 화요일 휴무를 귀국일 주의사항에 연결. 12/15 방문 확정으로 만들지 않음 |
| 나리타·신바시 | [국제선 출발](https://www.narita-airport.jp/en/airportguide/inter-dep/), [공항 교통](https://www.narita-airport.jp/en/access/), [JR 역 안내](https://www.jreast.co.jp/estation/station/info.aspx?StationCd=877) | 출국 절차·역 안내. 공항 도착 목표·철도 경로는 여행 계획이며 항공사 마감·12월 열차 시각은 미확정 |

숙소는 공개 시설 정보로 예약 상태를 재검증하지 않았습니다. 기존 Notion의 주소 구역·예약 확인 필요 상태를 그대로 보존하고 체크인·짐 보관 확인 순서를 보강했습니다. 신규 좌표·실시간 별점·리뷰·예약 확정값을 추가하지 않았습니다.

[Notion 원본](https://app.notion.com/p/3cd6d10af85a802cab35dae642ee3500)

## 충돌·미확정 처리

- 원본 하단에는 포케파크·숙소 결제 기록과 티켓 첨부가 있습니다. 상단에는 예약 상태·권종·QR 확인 체크가 남아 있으므로 결제 기록은 반영하되 최종 예약 확정으로 간주하지 않았습니다.
- 숙소 주소는 Notion의 東京都港区新橋5丁目29입니다. 국토지리원 주소 검색에서 新橋五丁目２９番 대표점 (35.662514, 139.755707)을 확인해 신바시역과 별도 핀으로 표시합니다. 건물 입구·실제 예약 상태는 미확정이며 결제 금액·호실·추적 파라미터는 옮기지 않았습니다.
- 해리포터 10:00은 합의 시간, 결제 미확인. 저녁 약속은 시간·장소·식당 예약 미확정입니다.
- Notion의 포케파크 12:00–20:00 표기는 12/12 운영시간으로 검증하지 못했으므로 운영시간 확정값으로 사용하지 않았습니다. 입장 준비 12:00은 계획 시각입니다.
- 공유 항공편 외 일행 전체 항공권·항공사 수속 마감은 별도 확인합니다. 참여자·담당자 이름은 화면에서 제거했습니다.
- 영상 링크는 공식 사이트에 포함된 경우 해당 공식 안내를 연결합니다. 포케파크 YouTube 링크는 Notion에서 가져왔으며 게시자·영상 내용을 별도 확인하지 못해 앱에 재확인 필요로 표시했습니다. 모든 날짜의 개별 영상 출처를 검증한 것은 아닙니다.

## 좌표 기준

공식 주소·매장 층수를 확인하고, 공식 매장 지도나 별도 지리 자료의 대표 좌표를 대조했습니다. 좌표가 시설 입구·엘리베이터·개별 매대 위치를 보장하지는 않습니다. 넓은 공원·단지는 대표점, 쇼핑 지역은 역 기준점입니다. 아래 링크에서 재검증할 수 있습니다.

| 장소 | 위도, 경도 | 위치 기준 | 좌표 출처 |
| --- | --- | --- | --- |
| 나리타국제공항 T2 | 35.773361, 140.38775 | 시설 대표 위치 · 출입구는 현장 안내 확인 | [좌표 자료](https://www.wikidata.org/wiki/Q58043419) |
| 신바시역 | 35.666301, 139.758679 | 역 대표 위치 · 숙소 주소 구역과 별도 | [좌표 자료](https://en.wikipedia.org/wiki/Shimbashi_Station) |
| 오다이바 해변공원 | 35.631174, 139.776455 | 공원 대표 위치 · 자유의 여신상까지 해변 산책 | [좌표 자료](https://www.olympedia.org/venues/2103) |
| 도쿄타워 · 조조지·시바공원 | 35.65861, 139.74556 | 시설 대표 위치 · 출입구는 현장 안내 확인 | [좌표 자료](https://en.wikipedia.org/wiki/Tokyo_Tower) |
| 요미우리랜드 / PokéPark KANTO | 35.6258, 139.519 | 요미우리랜드 단지 대표 위치 · 포케파크 입구는 원내 안내 확인 | [좌표 자료](https://commons.wikimedia.org/wiki/Category:Yomiuriland) |
| 해리포터 스튜디오 투어 | 35.745698, 139.645715 | 시설 대표 위치 · 출입구는 현장 안내 확인 | [좌표 자료](https://en.wikipedia.org/wiki/Warner_Bros._Studio_Tour_Tokyo_%E2%80%93_The_Making_of_Harry_Potter) |
| STAR WARS STORE by BENELIC | 35.7307289, 139.7123836 | PARCO 건물 대표 위치 · 매장은 본관 6F | [좌표 자료](https://mapfan.com/spots/SCQQA%2CJ%2CH4) |
| Pokémon Center MEGA TOKYO | 35.7289056, 139.7193245 | 공식 사이트 지도 중심 좌표 · 매장은 alpa 2F | [좌표 자료](https://shop.pokemon.co.jp/en/shop/pokemoncenter-megatokyo/) |
| 아사쿠사 · 센소지 | 35.71472, 139.79675 | 시설 대표 위치 · 출입구는 현장 안내 확인 | [좌표 자료](https://en.wikipedia.org/wiki/Sens%C5%8D-ji) |
| 도쿄 스카이트리 | 35.7101, 139.8107 | 시설 대표 위치 · 출입구는 현장 안내 확인 | [좌표 자료](https://en.wikipedia.org/wiki/Tokyo_Skytree) |
| Pokémon Center SKYTREE TOWN | 35.7103448, 139.8126119 | 공식 사이트 지도 중심 좌표 · 매장은 East Yard 4F | [좌표 자료](https://shop.pokemon.co.jp/en/shop/pokemoncenter-skytreetown/) |
| 아키하바라 | 35.69833, 139.77306 | JR 아키하바라역 대표 위치 · 개별 매장은 검색 링크 이용 | [좌표 자료](https://en.wikipedia.org/wiki/Akihabara_Station) |
| 츠키지 장외시장 | 35.6649018, 139.7686095 | 공식 사이트 지도 중심 좌표 · 시장 지역 대표 위치 | [좌표 자료](https://www.tsukiji.or.jp/english/access/) |
| 긴자 | 35.67123, 139.765 | 긴자역 대표 위치 · 쇼핑 지역 기준점 | [좌표 자료](https://en.wikipedia.org/wiki/Ginza_Station) |

## 공식 주소·시설 안내

- [나리타국제공항 T2](https://www.narita-airport.jp/en/access/): 千葉県成田市古込字古込1-1 第2旅客ターミナルビル
- [신바시역](https://www.jreast.co.jp/estation/station/info.aspx?StationCd=877): 東京都港区新橋2丁目（역 주소）
- [오다이바 해변공원](https://www.gotokyo.org/en/spot/39/index.html): 東京都港区台場1-4
- [도쿄타워 · 조조지·시바공원](https://en.tokyotower.co.jp/): 東京都港区芝公園4-2-8（도쿄타워）
- [요미우리랜드 / PokéPark KANTO](https://www.pokepark-kanto.co.jp/ppark/ticketInfo/type/index): 東京都稲城市矢野口4015-1（PokéPark KANTO 공식 주소）
- [해리포터 스튜디오 투어](https://www.wbstudiotour.jp/plan-your-visit/location/): 東京都練馬区春日町1-1-7
- [STAR WARS STORE by BENELIC](https://benelicstore.com/info/news/20260902_storenews/): 東京都豊島区南池袋1-28-2 池袋PARCO 本館6F
- [Pokémon Center MEGA TOKYO](https://shop.pokemon.co.jp/en/shop/pokemoncenter-megatokyo/): 東京都豊島区東池袋3-1-2 Sunshine City alpa 2F
- [아사쿠사 · 센소지](https://www.senso-ji.jp/access): 東京都台東区浅草2-3-1
- [도쿄 스카이트리](https://www.tokyo-skytree.jp/): 東京都墨田区押上1-1-2
- [Pokémon Center SKYTREE TOWN](https://shop.pokemon.co.jp/en/shop/pokemoncenter-skytreetown/): 東京都墨田区押上1-1-2 Solamachi East Yard 4F
- [아키하바라](https://www.gotokyo.org/en/destinations/central-tokyo/akihabara/index.html): 東京都千代田区外神田・神田佐久間町 일대（지역）
- [츠키지 장외시장](https://www.tsukiji.or.jp/english/access/): 東京都中央区築地4丁目 일대（시장 지역）
- [긴자](https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html): 東京都中央区銀座4-1-2（긴자역 대표 주소）

- 나리타 T2 상세 주소 대조: [공항 검역소 공식 조직·위치](https://www.forth.go.jp/keneki/narita/guide/org.html).
- 신바시역 주소: [JR동일본 역 정보](https://www.jreast.co.jp/estation/station/info.aspx?StationCd=877).
- 아키하바라역 대표 주소: [JR동일본 역 정보](https://www.jreast.co.jp/estation/station/info.aspx?StationCD=41).
- 긴자역 기준 주소: [도쿄메트로 공식 역 정보](https://www.tokyometro.jp/station/ginza/index.html).
- 도쿄타워 일반 운영 안내 대조: [GO TOKYO](https://www.gotokyo.org/en/spot/4/).
- 오다이바 대표점은 [Olympedia](https://www.olympedia.org/venues/2103)의 공원 좌표입니다. 자유의 여신상 위치와 동일하지 않습니다.
- 요미우리랜드 대표 좌표는 Wikimedia의 공원 좌표를 소수 4자리로 반올림했습니다. 포케파크 전용 입구는 [공식 접근 안내](https://www.pokepark-kanto.co.jp/ppark/access/index)를 따릅니다.
- 포켓몬센터와 츠키지는 공식 사이트에 연결된 Google embed의 지도 중심값입니다. 앱에 지도 중심 좌표라는 한계를 표시합니다.

## 교통·일정

Notion 시간표의 계획 소요를 보존했습니다. 12월 운행표·당일 지연·실제 운임은 검증하지 않았습니다. 직통 여부는 해당 열차 행선지와 시간표를 확인해야 합니다.

- [게이세이 공항 접근](https://www.keisei.co.jp/keisei/tetudou/skyliner/us/): Access Express 직통 여부·Skyliner 예약 확인.
- [유리카모메](https://www.yurikamome.co.jp/en/): 신바시–오다이바 이동 안내.
- [요미우리랜드 접근](https://www.yomiuriland.com/traffic/): 게이오요미우리랜드역·곤돌라 운행 확인.
- [스튜디오 접근](https://www.wbstudiotour.jp/plan-your-visit/location/): 토시마엔역 도보 약 2분.
- [스카이트리 접근](https://www.tokyo-skytree.jp/access/public-transport/): 도부·오시아게 접근 확인.

위 링크 중 교통 운영사 페이지는 원본 Notion의 재확인용 링크이며 이번 작업에서 12월 시간표까지 독립 검증하지 않았습니다.

## Google 구현 자료

- [Maps JavaScript API 공식 로딩](https://developers.google.com/maps/documentation/javascript/load-maps-js-api)
- [Advanced Markers 공식 가이드](https://developers.google.com/maps/documentation/javascript/advanced-markers/start)
- [API 키 없는 Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)

## 숙소 주소와 사진 보강

숙소는 [국토지리원 주소 검색](https://msearch.gsi.go.jp/address-search/AddressSearch?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%AF%E5%8C%BA%E6%96%B0%E6%A9%8B5%E4%B8%81%E7%9B%AE29)의 구역 대표점을 사용합니다. 신바시역은 숙소 건물 위치가 아닙니다. 사진 14장의 원본·저작자·재사용 조건은 [사진 출처 목록](../public/photos/LICENSE.md)에 있습니다.


## Notion 티켓 원문 대조 · 2026-10-18

사용자 요청으로 여행 본문과 연결된 예약·항공권 페이지를 다시 읽었습니다. 포케파크 PDF3장 모두 텍스트를 대조하고 첫 PDF의 렌더링도 확인했습니다. 공통 사실은 2026-12-12 Trainer’s Pass, 포켓몬 포레스트 입장 가능11:00–12:00, 요미우리랜드·카야츠리 타운은 운영시간 내 입장입니다. 티켓 번호·주문번호·QR·개인 항공권은 앱 데이터와 공개 자산에 복사하지 않았습니다. 원문은 비공개 Notion 예약 페이지에서 확인합니다.

기존 Notion 시간표의 13시 포레스트 계획보다 티켓 지정시간을 우선했습니다. 웹앱은08:00 신바시 출발·09:45 공원 도착·10:30 입구 준비·11:00 포레스트 체험을 계획하며 실제 개장·운행은 재확인 대상입니다. 13:00은 이후 점심·타운 이동을 위한 계획값이며 티켓 관람 종료시각이 아닙니다. 해리포터는 사용자 지시에 따라10:00 입장 기준으로 고정하고 예매·결제 완료는 미확인으로 유지했습니다. 원본 Notion 문서의 수동 편집은 변경하지 않았습니다.

테마 65개 개별 조사: THEME_RESEARCH_BASE.md(25), THEME_RESEARCH_SHARED.md(26), THEME_RESEARCH_PRODUCTS.md(14). 공식 안내 56개·사진/이미지 원문 48개입니다. 사진 원문은 과거 사진·시설 소개 이미지·상품 사진과 정확한 SNS 촬영 구도 확인을 구분합니다. 운영사가 사용권을 제공하지 않은 사진을 로컬 자산으로 다운로드하거나 직접 외부 이미지로 표시하지 않았습니다.


## 실제 조망·테마 대표사진 추가

추가 8장 중 아카바네바시 교차점 조망·아자부다이33층 조망은 Commons의 촬영지 설명, 시바 편의점 사진은 Unsplash 무료 라이선스와 점포 외관 대조를 근거로 연결했습니다. 시바 사진 원문에는 점포명·촬영 좌표가 없어 동일 발 위치를 확정하지 않습니다. 자세한 근거는 src/data/viewPhotoCandidates.json에 있습니다. 요요기5초메 철길·케야키자카2024·오뎅·편의점·드럭스토어 대표자료는 src/data/themeCoverCandidates.json과 public/photos/THEME_COVER_LICENSE.md에 기록했습니다. 개별 장소·제품과 다른 대표자료는 캡션에서 구분합니다.

공식 사진 원문 링크 48개는 유지하고, 별도로 라이선스가 확인된 실제 이미지 29장을 로컬에서 제공합니다. Unsplash 사진 1장은 해당 사진 페이지의 Download free·Unsplash License 표기와 라이선스 본문을 확인했습니다. 원본 픽셀은 변조하지 않고 비율을 유지해 축소 표시합니다. 촬영 이후 건물·조명·입장 조건은 바뀔 수 있습니다.

## 운영 안내·사진 보강 · 2026-10-18

현재13테마84후보입니다. 후보별 운영시간·휴무·입장 조건·출처·확인일은 visitorInfo-base.json, visitorInfo-researched.json, architectureTheme.ts, subcultureTheme.ts에 있습니다. 공식 페이지 내부 시간 충돌이나 정확한 점포 미식별은 미확인으로 남깁니다. 도쿄국립박물관·호류지보물관12/14정기휴관과12/15설비휴관, 국립신미술관12/15화요일 휴관 등 여행 날짜와 겹치는 조건을 표시합니다. 상세 근거는 ARCHITECTURE_PLACES.md, SUBCULTURE_PLACES.md를 참고하세요.

로컬 사진 70개를 등록했고 후보52/84개에 연결합니다(같은 사진 재사용 포함). 야경12/12, 건축8/10, 서브컬처8/9입니다. 미확보 32개에는 상품 14개와 정확한 촬영점·점포·사용권을 확보하지 못한 장소가 포함됩니다. 대표사진은 개별 매장·상품 사진을 대신하지 않습니다. 사진별 원문·저자·라이선스는 public/photos/LICENSE.md와 photos.json에 있습니다. ITEM_PHOTOS.md에는 공식 이미지 열람 링크와 직접 재사용하지 않은 이유를 기록했습니다.

추가 사진 조사: FOOD_PHOTO_FOLLOWUP.md·PLACE_PHOTO_FOLLOWUP.md·PRODUCT_PHOTO_FOLLOWUP.md. 웨스트 아오야마 가든 실제 팬케이크 1장과 나나야 상품 2장을 연결했습니다. 나나야 촬영 지점은 아오야마점으로 확정하지 않습니다. 철길 테마 대표는 요요기역 인근 철교 CC0 사진으로 바꿨으며 SNS 촬영 지점과 동일하다고 표시하지 않습니다.

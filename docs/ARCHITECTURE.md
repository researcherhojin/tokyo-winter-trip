# 모듈 경계

현재 프런트엔드는 React + TypeScript + Vite입니다. Vercel은 Vite도 지원하므로 배포만을 위해 Next.js를 요구하지 않습니다. Next.js 전환 여부는 사용자 선택 후 반영합니다.

| 모듈 | 책임 |
| --- | --- |
| `App.tsx` | 선택 날짜·화면·장소 상태와 화면 조합 |
| `DateNavigation.tsx` | 날짜·전체 일정·모바일 보기 선택 |
| `DaySchedule.tsx` | 하루 일정·이동·방문 가이드 렌더링 |
| `TravelMap.tsx` | Google 지도 생명주기·범위·번호 마커·오류 대체 화면 |
| `PlaceDetail.tsx` | 장소 상세와 길찾기 |
| `PlacePhoto.tsx` | 사진·저작자·라이선스·이미지 실패 처리 |
| `Checklist.tsx` · `PreparationStatus.tsx` · `styles/preparation.css` | 체크·기기 저장·백업·복원, 우선 확인·실행 안내·미완료 필터 |
| `useTripSource.ts` | 선택적 서버 갱신·취소·마지막 정상 응답 유지 |
| `shared/catalog.ts` · `catalogClient.ts` | 여행·테마·준비 읽기 응답 계약·중첩 검증·정적 대체 데이터 |
| `useCatalog.ts` · `PlaceCatalogContext.tsx` | 화면별 API 조회·실패 대체·장소 데이터 공통 소비 |
| `server/catalogResponse.ts` | 세 자료 조회 응답·읽기 메서드 제한·공통 캐시 정책 |
| `api/catalog/` · `functions/api/catalog/` | Vercel·Cloudflare 읽기 API 연결. 개발 환경은 Vite middleware 사용 |
| `PageHeader.tsx` · `index.css` | 보조 화면 공통 제목·레이아웃·타이포·상태·디자인 토큰 |
| `liveTrip.ts` | 응답 검증과 시간표를 화면 데이터로 변환 |
| `googleMaps.ts` | 공식 SDK 로드·공식 라이브러리 타입·인증 실패 |
| `links.ts` | 키 없는 검색·이동 URL 생성 |
| `visits.ts` | 지도·일정 공통 방문 번호와 중복 제거 |
| `mapViewport.ts` | 패널·모바일 시트에 가리지 않는 지도 범위 |
| `PreparationGuide.tsx` | Suica 한국어 안내와 요요기 방문 후보 |
| `ThemeExplorer.tsx` · `ThemeSpotCard.tsx` · `themes.ts` | 테마 그룹·검색·후보 저장, 공통 카드·외부 지도 연결 |
| `data/spots/<테마>.json` · `data/spots/index.json` | 테마 후보 1곳 = 1레코드: 이름·설명·운영(visitorInfo)·공식 근거(evidence)·여행일 휴무(closures)·관계(relation)·장면(scene, 현재 화면 미표시)·대표/추가/참고 사진 ID·사진 없음 이유(photoGap). 테마 순서는 index.json |
| `themes.ts` · `themeEvidence.ts` · `visitorInfo.ts` | 레코드를 읽어 제외 사진을 걸러 내는 로더와 타입. 운영 정보가 없는 후보의 기본 안내 문구 |
| `references.ts` | 최신 입장 공지 등 일정·장소에서 함께 쓰는 공식 링크 |
| `YenExchange.tsx` · `exchange.ts` | 참고 환율 조회·검증·환산·오류 표시 |
| `data/` | 일정·장소·사진 출처 데이터 |
| `server/notion.ts` | 인증된 읽기·페이지네이션·시간표 추출 |
| `server/tripResponse.ts` | API 응답·인스턴스 캐시·동시 조회 합치기 |
| `api/trip.ts` | Vercel 런타임과 공통 서버 로직 연결 |
| `functions/api/trip.ts` | Cloudflare 런타임과 공통 서버 로직 연결 |

화면은 서버 비밀키를 읽지 않습니다. 서버 파일은 프런트엔드에서 타입만 참조하므로 브라우저 번들에 서버 구현이 포함되지 않습니다. 지도 SDK가 실패해도 일정과 외부 길찾기는 유지됩니다. 프런트·서버 파일은 모두 TypeScript 빌드 대상입니다.

별도 상태관리·백엔드 프레임워크·ORM·컴포넌트 라이브러리는 추가하지 않았습니다. 단일 여행·단일 페이지 범위에 맞춘 구조이며 향후 공유 체크리스트와 사용자 인증이 필요하면 별도 저장·인증 설계를 해야 합니다.

2026-10-18부터 세 화면이 각각 `/api/catalog/trip`, `/api/catalog/themes`, `/api/catalog/preparation`을 실제 소비합니다. 기본 자료를 즉시 표시하고 검증된 응답만 적용하므로 Functions가 없는 정적 배포도 사용 가능합니다. 계약과 한계는 `docs/API.md`에 있습니다. 카탈로그는 배포한 안내 자료이며 실시간 장소 검색·공유 체크리스트 DB와 구분합니다.

`lib/navigation.ts`는 날짜와 화면의 URL 상태를 관리합니다. 기존 `?day=3`, `?day=all` 링크를 유지하고, 테마·준비 화면에는 `view=themes`, `view=checklist`를 사용합니다. 새로고침·브라우저 뒤로/앞으로 가기도 같은 화면과 날짜를 복원하며 같은 메뉴를 다시 누르면 방문 기록을 추가하지 않습니다.

지도 마커의 갱신 기준에는 장소 ID뿐 아니라 이름·좌표가 포함됩니다. API 응답이 늦게 도착해도 지도와 상세 자료가 같은 좌표를 사용합니다. 체크리스트는 API에서 추가된 항목의 저장 값도 보존합니다. Notion 응답의 잘못된 중첩 자료·시간·날짜는 적용하지 않고, 통신 실패에는 마지막 정상 일정과 갱신 지연 표시를 유지합니다. 서버가 명시적으로 연동 비활성 상태를 반환하면 기본 일정으로 전환합니다.


## 여행 중 사용 보강

- travelSupport.ts: 고정 예약 근거·날짜별 우선순위·지연 시 조정·지역별 대안 검색어.
- TravelSupport.tsx: 다음 일정·출발지 선택·길찾기, 방문 상태 선택, 근처 대안, 필수 정보 모달.
- travelProgress.ts / useTravelProgress.ts: JST 시각과 방문 완료·건너뜀 상태로 다음 계획을 선택. 상태는 로컬에 저장하고 다른 탭 저장 변경도 반영합니다. 시간 경과만으로 방문 완료를 기록하지 않습니다.
- reservationAnchors.ts: 이전 Notion 시간표보다 확인된 포케파크 티켓11–12시와 해리포터10시 기준을 우선 적용합니다. 포케파크 당일 계획은 검증된 티켓에 맞춘 기본 동선을 사용하므로 Notion 해당 날짜 변경은 자동으로 재계획하지 않습니다.
- 테마 후보의 공식 소개·사진 원문·확인일·한계는 각 레코드의 evidence에 있습니다. 테마 API도 같은 레코드를 보내며 URL·중첩 필드 검증을 거칩니다.

근처 대안은 Google Maps 외부 검색입니다. 앱은 실시간 거리·영업·평점·GPS를 조회하거나 예약하지 않습니다. 외부 사진은 원문 페이지 링크, 앱 안의 사진은 기존 라이선스 자산으로 구분합니다.


## 일정 실행 안내와 사진 미리보기

`data/itineraryDetails.json`은 32개 일정의 목적·진행 순서·확인사항·다음 이동·공식 참고 링크를 저장합니다. `StopGuide.tsx`는 접힌 실행 가이드와 출처를 표시하며 `DaySchedule.tsx`는 한 문장 목적을 먼저 표시합니다. 카탈로그는 중첩 목록을 검증합니다. Notion 일정의 제목·시간·장소가 바뀌면 기존 가이드를 무조건 이식하지 않으며, 완전히 일치하는 항목만 재사용합니다.

`ThemeImage.tsx`는 크롭 미리보기와 전체 사진 모달을 공통 제공하고 CSS가 높이를 제한합니다. hover·키보드 focus는 전체 구도를 같은 프레임 안에서 표시합니다. 사진 라이선스와 원본 위치 확인 범위는 데이터로 분리합니다.

## 테마 정리와 사진 아카이브

lib/themeOrganization.ts는 중복 컬렉션 통합·후보 별칭·기존 저장 값 연결·한국어 이름 정렬을 담당합니다. 캐릭터와 굿즈 테마를 합치고 같은 롯폰기 겨울 산책을 야경에 모았습니다. API 기본 자료와 UI 모두 같은 정렬을 사용하며 사진 우선 정렬은 UI 선택입니다. 테마 11개·항목 78개이며 같은 장소라도 야경·건축 등 목적이 다르면 각 테마의 설명을 유지합니다.

카드 사진은 ThemeImage.tsx의 ThemeGallery가 담당합니다. 4:3 프레임 안에 원본 전체(contain)를 같은 사진의 흐린 배경 위에 올려 어떤 사진도 자르지 않습니다(photos.ts의 photoMode). 여러 장은 스크롤 스냅 캐러셀·점·이전/다음 버튼·좌우 화살표 키로 넘깁니다. 상태 배지와 저장 버튼은 사진 위에 둡니다. 애니메이션은 opacity·transform만 사용하고, 모션 줄이기 설정에서는 모두 끕니다. 전체 사진 모달은 @starting-style로 열리고 닫힐 때 짧은 퇴장 전환 뒤 원래 사진으로 포커스를 돌려줍니다. 일정 화면의 PlacePhoto·PlaceThumbnail도 같은 무크롭 방식입니다.

photos:archive는 현재 카탈로그 전체 후보의 보관·미확보 상태와 사진 원문·저자·라이선스·크기·SHA-256을 기록하고 누락 파일을 거부합니다. public/photos/archive.json, docs/PHOTO_ARCHIVE.md, LICENSE.md를 다시 생성합니다. 주변 시설 참고 사진은 대표 사진 미확보를 완료로 바꾸지 않습니다.

실제 사진이 없는 후보의 「비슷한/제조사/판매처 참고 사진」은 레코드의 referencePhotoId로 지정합니다. themePhoto.ts가 사진의 reference 표시가 있을 때만 보여주고, 참고 사진은 대표 사진 확보 수에 넣지 않습니다.


사진 없는 후보의 사유(location·store·product·rights)는 레코드의 photoGap에 있습니다. themePhoto.ts의 photoGap이 카드 문구를 정하고 photos:archive도 같은 기준으로 분류합니다.

photoReview.json은 부적합 사진 18개의 제외 사유를 관리합니다. photos.ts가 해당ID의 재노출을 차단하고 themes.ts는 제외된 대표·추가 사진 참조를 API 자료에서 제거합니다. 제외 자산은 public 밖으로 이동했습니다. auditedPlacePhotos.json의 MEGA TOKYO·치이카와랜드 실제 사진과 auditedTowerPhoto.json의 별도 후다노쓰지 사진은 현재 manifest에 연결했습니다. 아카이브 생성도 제외ID가 manifest로 돌아오면 실패합니다.

themeOrganization.ts는 삭제 요청한 재즈바·고양이책방·타임스 파킹ID를 저장 표시와 오래된 API 자료에서 제거합니다. 그 외 기존 저장 값과 별칭은 유지합니다. 최신 범위와 후속 작업은 [현재 상태](PROJECT_STATUS.md)를 참고합니다.

## 개발 서버 캐시 분리

Vite 개발 서버는 node_modules/.vite-dev를 사용하고 의존성 탐색 진입점을 index.html로 제한합니다. 테스트와 사진 아카이브의 SSR 자료 로더는 각각 별도 캐시 디렉터리를 사용하며 optimizeDeps.noDiscovery와 빈 include로 브라우저 의존성 최적화를 실행하지 않습니다. 자료 조회·검증이 실행 중인 개발 서버 캐시를 교체하지 않도록 분리했습니다. 개발 포트5173은 strictPort로 고정해 다른 포트에서 잘못된 서버를 확인하는 일을 방지합니다.

## 테마 데이터 재구성 · 2026-10-18

한 후보의 정보가 최대 9개 파일(테마 TS, 공유 후보, 근거 JSON 3개, 운영 JSON 2개, 사진 매핑 JSON 여러 개, 휴무·참고 사진·사진 없음 목록)에 흩어져 있어, 다른 가게 근거가 섞이는 오류가 생겼습니다. 화면에 보이던 최종 결과를 그대로 후보별 레코드로 옮기고(`src/data/spots/`), 이전 파일 32개는 `docs/data-audit/legacy/`에 기록으로 보관했습니다(앱은 읽지 않음).

- 이전·이후 화면 데이터 스냅샷 비교: 13개 테마·88개 후보의 21개 필드 차이 0
- `tests/catalog.test.mjs` 「spot records keep one complete, officially sourced record per candidate」: 필수 필드·확인일·출처(공식 페이지·일정 장소·사용자 공유 게시물)·비공식 표현 금지·휴무 날짜 범위 검사
- 새 후보·수정은 해당 테마 JSON 한 곳만 고칩니다. 사진 메타데이터는 계속 `photos.json` 한 곳입니다.
- 일정 장소의 추가 사진은 `auditedPlacePhotos.json`의 placeExtraPhotoIds로 지정하고, 장소 상세가 카드와 같은 갤러리로 보여줍니다.

## 스타일 구조 · 2026-10-18

`src/index.css`는 순서만 정하고 실제 규칙은 `src/styles/`에 있습니다: `base.css`(토큰·헤더·공통 버튼·대화상자), `trip.css`(여행 지도·일정·가이드·필수 정보), `theme.css`(테마 탐색·카드·사진·정보 창), `preparation.css`(준비 체크). 불러오는 순서는 base → trip → theme이며 같은 선택자를 다른 파일에 다시 쓰지 않습니다.

분리 때 같은 선택자가 뒤에서 덮어쓰던 선언 28개를 제거하고 여러 화면에 걸친 선택자 3개는 화면별로 나눴습니다. 이전·이후를 12개 화면(여행 지도·테마·애니·준비 체크·사진 창·필수 정보 × 1440·390)의 모든 요소 계산 스타일 30개 속성으로 비교해 Google 지도 로더가 넣는 요소 외 차이 0을 확인했습니다.

## 화면별 코드 분할 · 2026-10-18

`App.tsx`는 테마 탐색과 준비 체크를 `React.lazy`로 처음 열 때 불러옵니다. 카탈로그 계약(경로·타입·검증)은 데이터가 없는 `shared/catalogContract.ts`에 있고, 각 화면이 자기 기본 자료만 넘겨 검증합니다(`useCatalog(resource, baseline)`). `shared/catalog.ts`는 서버 응답과 테스트를 위해 전체 자료와 기존 `isCatalogEnvelope`를 유지합니다.

- 첫 화면(여행 지도) JS: 771kB → 566kB(gzip 202 → 149kB). 테마 186kB·준비 체크 20kB는 화면을 열 때 로드.
- DOM 테스트는 번들 하나를 실행하므로 `SINGLE_BUNDLE=1`일 때만 분할을 끕니다(`vite.config.ts`). 실제 빌드는 분할합니다.
- 남은 500kB 경고: 첫 화면에도 필요한 사진 메타데이터(`photos.json` 240kB)가 주원인입니다. 화면별로 나누려면 사진 ID 조회 구조를 바꿔야 해 다음 단계로 둡니다.

## 테마 카드·준비 체크·지도 맞춤 (2026-10-18)

- **카드 6칸.** `ThemeSpotCard.tsx`는 사진·제목·설명·운영 요약·지도 버튼·정보 버튼 6칸을 subgrid로 맞춥니다(`theme.css`의 `grid-row:span 7`/`2 / span 6`). 운영시간·휴무는 `closedLines`로 「 · 」·「 / 」 단위 최대 2줄, `cardFact`가 괄호 세부를 뺍니다. 전체 정보·주소·여행 중 휴무·출처·공식 자료는 `InfoDialog`(열 때만 렌더링)에 있습니다.
- **사진 순서.** `lib/themePhoto.ts`의 `cardPhotoOrder`가 같은 시간대(낮/밤) 사진 중 4:3 틀을 가장 잘 채우는 사진을 앞에 둡니다. 정확한 사진을 참고 사진 뒤로 보내지 않습니다. 사진이 없으면 라벨 타일(이름·주소·공식 사진·Google 이미지 검색 링크)을 씁니다.
- **테마 순서.** `ThemeExplorer.tsx`의 `themeGroups`가 사이드바 묶음과 기본 선택(첫 묶음의 첫 테마)을 정하고, `data/spots/index.json`의 `order`도 같은 순서입니다.
- **준비 체크 탭.** `Checklist.tsx`는 한 번에 한 그룹만 렌더링합니다. 첫 미완료 그룹을 기본 탭으로 열고, 우선 확인 항목을 누르면 해당 탭으로 이동합니다.
- **휴대폰 지도 맞춤.** `TravelMap.tsx`의 `fitMap`이 `.date-bar`·`.map-toolbar`·`.itinerary-panel` 위치를 재서 남는 영역에 마커를 맞춥니다(남는 높이 80px 미만이면 하단 여백을 줄임). 데스크톱 여백은 `mapViewport.ts`의 72/72/80/56px.

## 사진 검수 도구 (2026-10-18)

- `.claude/skills/tokyo-photo-vetting/SKILL.md`: 사진을 찾거나 바꿀 때의 순서(카드 주인공 정하기 → 자유 라이선스 → 접촉 시트 검수 → 사용자 승인 → 반영·배포).
- `scripts/contact-sheet.mjs`: 후보 사진을 4:3 칸에 자르지 않고 모아 보는 HTML을 만들고 Playwright로 캡처해 검수합니다.
- `lib/themePhoto.ts`의 `cardPhotoOrder(ids, nightOnly)`: 야경 테마에서만 밤 사진을 앞에 고정하고, 그 외 테마는 4:3 틀을 잘 채우는 정확한 사진을 앞에 둡니다.
- 테마 머리의 커버 사진 출처는 `ThemeExplorer.tsx`가 설명 아래 한 줄(`.theme-cover-credit`)로 표시해 13개 테마 머리 높이를 같게 유지합니다.
